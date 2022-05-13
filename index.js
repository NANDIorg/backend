const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const PORT = 13373
const connection = require("./connectMysql")
connection.connect((err)=> {
    if (err) {

        return console.error("Ошибка: " + err.message);
      }
      else{
        console.log("Подключение к серверу MySQL успешно установлено");
      }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const userRequest = require("./component/users/index")
const disputeRequest = require("./component/dispute/index")

app.use(userRequest)
app.use(disputeRequest)

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log(ip);
    res.send(ip)
})

app.get('/*', (req, res) => {
    res.status(404).send("Ты кто GET")
})
app.post('/*', (req, res) => {
    res.status(404).send('ты кто POST')
})

console.log("Порт : ", PORT);
app.listen(PORT)