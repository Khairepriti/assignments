// database/db.js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    uri: process.env.DATABASE_URL,
});

module.exports = connection;
