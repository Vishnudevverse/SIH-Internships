const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '1234', // Replace with your MySQL password
    database: 'sih_internships',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
