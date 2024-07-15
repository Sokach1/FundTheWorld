const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'demow'
});

// 连接到数据库
connection.connect((err) => {
    if (err) throw err;
    console.log('Successfully connected');
});

module.exports = connection;
