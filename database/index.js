const mysql = require("mysql2/promise");

function connectToDatabase(){
    return mysql.createConnection({
        port: 3306,
        database: "Coins",
        password: "secret123",
        user: "root",
        waitForConnections: true
    });
}

module.exports = connectToDatabase;