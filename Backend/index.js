const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Register user
app.post('/api/auth/register', async (c, res) => {
    const { name, email, password, skills } = c.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const id = uuidv4();
    try {
        await db.query('INSERT INTO users (id, name, email, password, skills) VALUES (?, ?, ?, ?, ?)', [id, name, email, password, JSON.stringify(skills || [])]);
        res.json({ message: 'Registration successful', user: { id, name, email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
app.post('/api/auth/login', async (c, res) => {
    const { email, password } = c.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            res.json({ accessToken: user.id, userName: user.name });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get user profile
app.get('/api/user/profile', async (c, res) => {
    const userId = c.headers.authorization.split(' ')[1];
    try {
        const [users] = await db.query('SELECT id, name, email, skills FROM users WHERE id = ?', [userId]);
        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
app.put('/api/user/profile', async (c, res) => {
    const userId = c.headers.authorization.split(' ')[1];
    const { skills } = c.body;
    try {
        await db.query('UPDATE users SET skills = ? WHERE id = ?', [JSON.stringify(skills), userId]);
        const [users] = await db.query('SELECT id, name, email, skills FROM users WHERE id = ?', [userId]);
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get all internships
app.get('/api/internships', async (c, res) => {
    try {
        const [internships] = await db.query('SELECT * FROM internships');
        res.json(internships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch internships' });
    }
});

// Get personalized recommendations
app.get('/api/recommendations', async (c, res) => {
    const userId = c.headers.authorization.split(' ')[1];
    try {
        const [users] = await db.query('SELECT skills FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        const userSkills = users[0].skills || [];
        const [internships] = await db.query('SELECT * FROM internships');

        const recommendations = internships.map(internship => {
            const requiredSkills = internship.requiredSkills || [];
            const matchingSkills = requiredSkills.filter(skill => userSkills.includes(skill));
            return {
                ...internship,
                matchScore: matchingSkills.length,
                matchingSkills
            };
        });

        recommendations.sort((a, b) => b.matchScore - a.matchScore);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// Add to wishlist
app.post('/api/wishlist', async (c, res) => {
    const user_id = c.headers.authorization.split(' ')[1];
    const { internship_id } = c.body;
    const id = uuidv4();
    try {
        // Use INSERT IGNORE to prevent errors on duplicate entries
        await db.query('INSERT IGNORE INTO wishlist (id, user_id, internship_id) VALUES (?, ?, ?)', [id, user_id, internship_id]);
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// Remove from wishlist
app.delete('/api/wishlist/:internship_id', async (c, res) => {
    const user_id = c.headers.authorization.split(' ')[1];
    const { internship_id } = c.params;
    try {
        await db.query('DELETE FROM wishlist WHERE user_id = ? AND internship_id = ?', [user_id, internship_id]);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// Get user's wishlist
app.get('/api/wishlist', async (c, res) => {
    const user_id = c.headers.authorization.split(' ')[1];
    try {
        const [wishlist] = await db.query('SELECT i.* FROM wishlist w JOIN internships i ON w.internship_id = i.id WHERE w.user_id = ?', [user_id]);
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Get user's wishlist ids
app.get('/api/wishlist/ids', async (c, res) => {
    const user_id = c.headers.authorization.split(' ')[1];
    try {
        const [wishlist] = await db.query('SELECT internship_id FROM wishlist WHERE user_id = ?', [user_id]);
        res.json(wishlist.map(item => item.internship_id));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist ids' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});