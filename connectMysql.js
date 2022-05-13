const mysql = require('mysql')
const connection = mysql.createConnection({
    host : "localhost",
    user: "test",
    password: "qwe",
    insecureAuth : true,
    database : 'diplom'
})

module.exports = connection