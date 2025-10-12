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

CREATE TABLE IF NOT EXISTS wishlist (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    internship_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (internship_id) REFERENCES internships(id),
    UNIQUE (user_id, internship_id)
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



INSERT INTO internships (id, title, company, location, domain, description, requiredSkills) VALUES
('9', 'Software Engineer Intern - Python', 'CodeCrafters', 'Bangalore', 'Backend', 'Develop backend services and automation scripts using Python and Django.', '["Python", "Django", "REST API", "Git"]'),
('10', 'Machine Learning Engineer Intern', 'AI Innovators', 'Hyderabad', 'AI/ML', 'Implement and deploy machine learning models for predictive analytics.', '["Python", "Scikit-learn", "TensorFlow", "SQL"]'),
('11', 'Cloud Engineer Intern (AWS)', 'Cloudify Inc.', 'Remote', 'Cloud', 'Assist in managing and scaling cloud infrastructure on AWS.', '["AWS", "EC2", "S3", "Terraform"]'),
('12', 'Product Manager Intern', 'ProductPulse', 'Mumbai', 'Product Management', 'Conduct market research and define product roadmaps for new features.', '["Product Management", "Market Research", "Agile", "JIRA"]'),
('13', 'iOS Developer Intern', 'AppMakers Co.', 'Pune', 'Mobile Dev', 'Build and maintain native iOS applications using Swift and SwiftUI.', '["Swift", "SwiftUI", "Xcode", "API Integration"]'),
('14', 'Android Developer Intern', 'MobileFirst', 'Chennai', 'Mobile Dev', 'Develop high-quality Android applications using Kotlin and Jetpack Compose.', '["Kotlin", "Android Studio", "Jetpack Compose", "REST API"]'),
('15', 'Data Analyst Intern', 'Quantum Analytics', 'Hybrid', 'Data Science', 'Generate insights from company data using SQL and data visualization tools.', '["SQL", "Tableau", "Python", "Pandas", "Excel"]'),
('16', 'Frontend Intern (Vue.js)', 'NextGen Web', 'Bangalore', 'Web Dev', 'Create interactive user interfaces using Vue.js and modern frontend tools.', '["Vue.js", "JavaScript", "HTML5", "CSS3", "Pinia"]'),
('17', 'Quality Assurance Intern', 'BugSlayers', 'Remote', 'QA', 'Perform manual and automated testing to ensure software quality.', '["Manual Testing", "Automation Testing", "Selenium", "JIRA"]'),
('18', 'Blockchain Developer Intern', 'CryptoChain', 'Remote', 'Blockchain', 'Work on decentralized applications (dApps) using Solidity and Ethereum.', '["Solidity", "Ethereum", "Hardhat", "JavaScript"]'),
('19', 'Digital Marketing Intern', 'MarketMinds', 'Delhi', 'Marketing', 'Execute digital marketing campaigns across SEO, SEM, and social media channels.', '["SEO", "Google Analytics", "Social Media Marketing", "Content Writing"]'),
('20', 'Backend Intern (Go)', 'GoSpeed', 'Bangalore', 'Backend', 'Build high-performance backend systems and microservices using Golang.', '["Golang", "Microservices", "gRPC", "PostgreSQL"]'),
('21', 'Game Developer Intern', 'GameVerse Studios', 'Pune', 'Game Dev', 'Develop and test game mechanics using Unity and C#.', '["Unity", "C#", "Game Design", "3D Modeling"]'),
('22', 'Technical Writer Intern', 'DocuTech', 'Hybrid', 'Content', 'Create clear and concise technical documentation for software products.', '["Technical Writing", "Markdown", "API Documentation", "Git"]'),
('23', 'Cloud Security Intern', 'SecureCloud', 'Hyderabad', 'Security', 'Focus on securing cloud environments and implementing security best practices.', '["AWS", "Cloud Security", "IAM", "VPC"]'),
('24', 'React Native Developer', 'MobileLink', 'Remote', 'Mobile Dev', 'Build cross-platform mobile apps for both iOS and Android from a single codebase.', '["React Native", "JavaScript", "Redux", "Expo"]'),
('25', 'Data Engineer Intern', 'DataFlow', 'Bangalore', 'Data Engineering', 'Design and build data pipelines for processing large volumes of data.', '["Python", "Apache Spark", "SQL", "ETL", "Airflow"]'),
('26', 'Systems Administrator Intern', 'InfraCore', 'Mumbai', 'IT Support', 'Manage and maintain server infrastructure and network systems.', '["Linux", "Bash Scripting", "Networking", "System Administration"]'),
('27', 'UX Researcher Intern', 'UserFocus', 'Remote', 'Design', 'Conduct user interviews and usability testing to inform design decisions.', '["User Research", "Usability Testing", "Personas", "Figma"]'),
('28', 'DevOps Intern (Azure)', 'AzureSphere', 'Chennai', 'DevOps', 'Automate software delivery pipelines using Azure DevOps services.', '["Azure", "CI/CD", "ARM Templates", "PowerShell"]'),
('29', 'Full Stack Intern (MERN)', 'Stackify', 'Hybrid', 'Full Stack', 'Develop end-to-end web applications using the MERN stack.', '["MongoDB", "Express.js", "React", "Node.js"]'),
('30', 'Business Analyst Intern', 'StrategyFirst', 'Delhi', 'Business', 'Analyze business processes and gather requirements for new IT projects.', '["Business Analysis", "Requirement Gathering", "SQL", "MS Visio"]'),
('31', 'Flutter Developer Intern', 'Appilo', 'Remote', 'Mobile Dev', 'Create beautiful, natively compiled applications for mobile from a single codebase.', '["Flutter", "Dart", "Firebase", "State Management"]'),
('32', 'AI Research Intern', 'FutureAI Labs', 'Bangalore', 'AI/ML', 'Contribute to cutting-edge research in natural language processing and computer vision.', '["PyTorch", "NLP", "Computer Vision", "Python"]'),
('33', 'IT Support Intern', 'TechHelp', 'Pune', 'IT Support', 'Provide technical assistance and support for incoming queries and issues.', '["Troubleshooting", "Customer Service", "Windows OS", "Networking"]'),
('34', 'Graphic Designer Intern', 'CreativeCanvas', 'Mumbai', 'Design', 'Create visual content for marketing materials, social media, and web platforms.', '["Adobe Photoshop", "Adobe Illustrator", "Graphic Design", "Branding"]'),
('35', 'Backend Engineer Intern (Java)', 'JavaWorks', 'Hyderabad', 'Backend', 'Develop enterprise-level backend applications using Java and the Spring Framework.', '["Java", "Spring Boot", "Hibernate", "Maven", "SQL"]'),
('36', 'Embedded Systems Intern', 'ChipDesign', 'Bangalore', 'Hardware', 'Work on firmware development for IoT devices using C/C++.', '["C++", "Embedded Systems", "Microcontrollers", "IoT"]'),
('37', 'Cloud Architect Intern', 'Architech', 'Remote', 'Cloud', 'Assist in designing and documenting scalable and reliable cloud solutions.', '["Cloud Architecture", "AWS", "Azure", "Solution Design"]'),
('38', 'Frontend Developer (Angular)', 'AngularPros', 'Pune', 'Web Dev', 'Build dynamic and responsive single-page applications using Angular.', '["Angular", "TypeScript", "RxJS", "HTML", "CSS"]'),
('39', 'Database Administrator Intern', 'DBMasters', 'Chennai', 'Database', 'Help manage, backup, and optimize company databases.', '["SQL", "Database Administration", "MySQL", "Performance Tuning"]'),
('40', 'Robotics Process Automation (RPA) Intern', 'AutomateNow', 'Hybrid', 'RPA', 'Develop software bots to automate repetitive business processes.', '["RPA", "UiPath", "Automation Anywhere", "Python"]'),
('41', 'Growth Hacking Intern', 'Growthify', 'Remote', 'Marketing', 'Experiment with innovative marketing strategies to drive user acquisition.', '["Growth Hacking", "A/B Testing", "Digital Marketing", "Analytics"]'),
('42', 'C++ Developer Intern', 'PerformanceCode', 'Bangalore', 'Backend', 'Work on high-performance computing and systems programming tasks.', '["C++", "Data Structures", "Algorithms", "Linux"]'),
('43', 'Project Management Intern', 'Projex', 'Delhi', 'Management', 'Assist project managers in planning, executing, and monitoring projects.', '["Project Management", "Agile", "Scrum", "Communication"]'),
('44', 'AR/VR Developer Intern', 'VirtualRealms', 'Hyderabad', 'AR/VR', 'Develop immersive augmented and virtual reality experiences using Unity.', '["Unity", "C#", "AR/VR", "3D Graphics"]'),
('45', 'Solutions Architect Intern', 'ClientSolvers', 'Mumbai', 'Consulting', 'Help design technical solutions to meet client business requirements.', '["Solution Architecture", "Client Facing", "AWS", "System Design"]'),
('46', 'Frontend Performance Intern', 'SpeedWeb', 'Remote', 'Web Dev', 'Analyze and optimize the performance and loading speed of web applications.', '["Web Performance", "Lighthouse", "JavaScript", "Browser DevTools"]'),
('47', 'Natural Language Processing Intern', 'LangTech', 'Bangalore', 'AI/ML', 'Work on NLP models for text classification, sentiment analysis, and chatbots.', '["NLP", "Python", "NLTK", "SpaCy", "Hugging Face"]'),
('48', 'Site Reliability Engineer (SRE) Intern', 'Reliability Co.', 'Pune', 'DevOps', 'Focus on automating infrastructure and improving system reliability and uptime.', '["SRE", "Kubernetes", "Prometheus", "Python", "Go"]'),
('49', 'Fintech Analyst Intern', 'Financetech', 'Mumbai', 'Finance', 'Analyze financial data and support the development of fintech products.', '["Finance", "Data Analysis", "SQL", "Python"]'),
('50', 'Ethical Hacker Intern', 'WhiteHat Inc.', 'Remote', 'Security', 'Conduct authorized penetration tests to identify and report security flaws.', '["Penetration Testing", "Ethical Hacking", "Metasploit", "Kali Linux"]'),
('51', 'Backend Developer (PHP)', 'WebWeavers', 'Kolkata', 'Backend', 'Maintain and develop web applications using PHP and the Laravel framework.', '["PHP", "Laravel", "MySQL", "Composer"]'),
('52', 'Data Visualization Intern', 'VizData', 'Hybrid', 'Data Science', 'Create compelling dashboards and data stories using tools like D3.js and Tableau.', '["Data Visualization", "D3.js", "Tableau", "JavaScript"]'),
('53', 'Cloud Engineer Intern (GCP)', 'GoogleCloudify', 'Bangalore', 'Cloud', 'Work with Google Cloud Platform services to deploy and manage applications.', '["GCP", "Kubernetes Engine", "Cloud Functions", "BigQuery"]'),
('54', 'Video Game Tester', 'PlayTest', 'Remote', 'QA', 'Play and test pre-release video games to find and document bugs.', '["Game Testing", "Bug Reporting", "Attention to Detail", "JIRA"]'),
('55', 'API Development Intern', 'ConnectAPI', 'Bangalore', 'Backend', 'Specialize in designing, building, and documenting RESTful and GraphQL APIs.', '["REST API", "GraphQL", "Node.js", "Postman", "Swagger"]'),
('56', 'Technical Support Engineer Intern', 'SupportPro', 'Noida', 'IT Support', 'Provide in-depth technical support to enterprise customers for complex software issues.', '["Technical Support", "Troubleshooting", "SQL", "Customer Communication"]'),
('57', 'E-commerce Specialist Intern', 'Shopify Experts', 'Remote', 'E-commerce', 'Manage and optimize online stores, focusing on user experience and conversion rates.', '["E-commerce", "Shopify", "SEO", "Digital Marketing"]'),
('58', 'Full Stack Developer (Python/React)', 'PyReact Solutions', 'Hyderabad', 'Full Stack', 'Build full-stack applications with a Python/Django backend and React frontend.', '["Python", "Django", "React", "PostgreSQL", "REST API"]');