const mysql = require('mysql2');
export const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'u6706375',
    password: '6706375',
    database: 'u6706375_csc350'
})