CREATE DATABASE IF NOT EXISTS sih_internships;
USE sih_internships;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skills JSON
);

CREATE TABLE IF NOT EXISTS internships (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    domain VARCHAR(255),
    description TEXT,
    requiredSkills JSON
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    internship_id VARCHAR(255) NOT NULL,
    application_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (internship_id) REFERENCES internships(id)
);

-- Clear existing data before inserting
TRUNCATE TABLE internships;

-- Insert sample data into internships table
INSERT INTO internships (id, title, company, location, domain, description, requiredSkills) VALUES
('1', 'Frontend Developer Intern', 'Innovate Inc.', 'Remote', 'Web Dev', 'Build modern web applications using React and TypeScript. Work with a dynamic team on cutting-edge projects.', '["React", "JavaScript", "CSS", "TypeScript"]'),
('2', 'Backend Developer Intern', 'TechCorp Solutions', 'Bangalore', 'Backend', 'Develop scalable APIs and microservices using Node.js and PostgreSQL.', '["Node.js", "PostgreSQL", "REST API", "Docker"]'),
('3', 'Data Science Intern', 'DataMinds AI', 'Hybrid', 'Data Science', 'Analyze large datasets and build machine learning models for business insights.', '["Python", "Machine Learning", "Pandas", "TensorFlow"]'),
('4', 'Mobile App Developer', 'AppGenius', 'Mumbai', 'Mobile Dev', 'Create beautiful and performant mobile applications for iOS and Android.', '["React Native", "JavaScript", "Mobile UI", "API Integration"]'),
('5', 'UI/UX Designer Intern', 'DesignHub', 'Remote', 'Design', 'Design user-friendly interfaces and create engaging user experiences.', '["Figma", "UI Design", "User Research", "Prototyping"]'),
('6', 'Full Stack Developer Intern', 'DevStack Pro', 'Delhi', 'Full Stack', 'Work on both frontend and backend to create complete web solutions.', '["React", "Node.js", "MongoDB", "JavaScript", "CSS"]'),
('7', 'DevOps Engineer Intern', 'CloudTech', 'Pune', 'DevOps', 'Manage CI/CD pipelines, containerization, and cloud infrastructure.', '["Docker", "Kubernetes", "AWS", "CI/CD"]'),
('8', 'Cybersecurity Analyst Intern', 'SecureNet', 'Hyderabad', 'Security', 'Identify vulnerabilities and implement security measures for enterprise systems.', '["Network Security", "Penetration Testing", "Python", "Linux"]');