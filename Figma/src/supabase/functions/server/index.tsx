import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Sample internship data
const sampleInternships = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'Innovate Inc.',
    location: 'Remote',
    domain: 'Web Dev',
    description: 'Build modern web applications using React and TypeScript. Work with a dynamic team on cutting-edge projects.',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'TypeScript']
  },
  {
    id: '2',
    title: 'Backend Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Bangalore',
    domain: 'Backend',
    description: 'Develop scalable APIs and microservices using Node.js and PostgreSQL.',
    requiredSkills: ['Node.js', 'PostgreSQL', 'REST API', 'Docker']
  },
  {
    id: '3',
    title: 'Data Science Intern',
    company: 'DataMinds AI',
    location: 'Hybrid',
    domain: 'Data Science',
    description: 'Analyze large datasets and build machine learning models for business insights.',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow']
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    company: 'AppGenius',
    location: 'Mumbai',
    domain: 'Mobile Dev',
    description: 'Create beautiful and performant mobile applications for iOS and Android.',
    requiredSkills: ['React Native', 'JavaScript', 'Mobile UI', 'API Integration']
  },
  {
    id: '5',
    title: 'UI/UX Designer Intern',
    company: 'DesignHub',
    location: 'Remote',
    domain: 'Design',
    description: 'Design user-friendly interfaces and create engaging user experiences.',
    requiredSkills: ['Figma', 'UI Design', 'User Research', 'Prototyping']
  },
  {
    id: '6',
    title: 'Full Stack Developer Intern',
    company: 'DevStack Pro',
    location: 'Delhi',
    domain: 'Full Stack',
    description: 'Work on both frontend and backend to create complete web solutions.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'CSS']
  },
  {
    id: '7',
    title: 'DevOps Engineer Intern',
    company: 'CloudTech',
    location: 'Pune',
    domain: 'DevOps',
    description: 'Manage CI/CD pipelines, containerization, and cloud infrastructure.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  },
  {
    id: '8',
    title: 'Cybersecurity Analyst Intern',
    company: 'SecureNet',
    location: 'Hyderabad',
    domain: 'Security',
    description: 'Identify vulnerabilities and implement security measures for enterprise systems.',
    requiredSkills: ['Network Security', 'Penetration Testing', 'Python', 'Linux']
  }
];

// Initialize internships data on startup
async function initializeData() {
  const existing = await kv.get('internships');
  if (!existing) {
    await kv.set('internships', sampleInternships);
    console.log('Initialized internships data');
  }
}

initializeData();

// Auth: Register
app.post('/make-server-bec93c94/api/auth/register', async (c) => {
  try {
    const { name, email, password, skills } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: 'Name, email, and password are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Registration error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile with skills
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      skills: skills || []
    });

    console.log(`User registered successfully: ${email}`);
    return c.json({ 
      message: 'Registration successful',
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.log(`Registration error: ${error}`);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Auth: Login (handled by Supabase client on frontend)
// This endpoint is just for consistency but actual login happens client-side

// Get user profile
app.get('/make-server-bec93c94/api/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while fetching profile: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.log(`Error fetching user profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-bec93c94/api/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while updating profile: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { skills } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`);

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = { ...profile, skills };
    await kv.set(`user:${user.id}`, updatedProfile);

    console.log(`Profile updated successfully for user: ${user.email}`);
    return c.json(updatedProfile);
  } catch (error) {
    console.log(`Error updating user profile: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get all internships
app.get('/make-server-bec93c94/api/internships', async (c) => {
  try {
    const internships = await kv.get('internships') || [];
    return c.json(internships);
  } catch (error) {
    console.log(`Error fetching internships: ${error}`);
    return c.json({ error: 'Failed to fetch internships' }, 500);
  }
});

// Get personalized recommendations
app.get('/make-server-bec93c94/api/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while fetching recommendations: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const userSkills = profile.skills || [];
    const internships = await kv.get('internships') || [];

    // Calculate match scores
    const recommendations = internships.map((internship: any) => {
      const matchingSkills = internship.requiredSkills.filter((skill: string) =>
        userSkills.some((userSkill: string) => 
          userSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      return {
        ...internship,
        matchScore: matchingSkills.length,
        matchingSkills
      };
    });

    // Sort by match score (highest first)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return c.json(recommendations);
  } catch (error) {
    console.log(`Error fetching recommendations: ${error}`);
    return c.json({ error: 'Failed to fetch recommendations' }, 500);
  }
});

Deno.serve(app.fetch);
