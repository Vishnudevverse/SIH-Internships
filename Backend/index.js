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

// Apply for an internship
app.post('/api/internships/:id/apply', async (c, res) => {
    const userId = c.headers.authorization.split(' ')[1];
    const internship_id = c.params.id;
    const id = uuidv4();
    try {
        await db.query('INSERT INTO applications (id, user_id, internship_id) VALUES (?, ?, ?)', [id, userId, internship_id]);
        res.json({ message: 'Application successful' });
    } catch (error) {
        res.status(500).json({ error: 'Application failed' });
    }
});

// Get user's applications
app.get('/api/user/applications', async (c, res) => {
    const userId = c.headers.authorization.split(' ')[1];
    try {
        const [applications] = await db.query(
            'SELECT i.title, i.company, a.application_date, a.status FROM applications a JOIN internships i ON a.internship_id = i.id WHERE a.user_id = ?',
            [userId]
        );
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});