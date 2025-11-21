const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = process.env.DB_PATH || path.join(__dirname, 'main.db');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
});

module.exports = db;