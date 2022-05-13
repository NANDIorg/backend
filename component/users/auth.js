const connection = require("../../connectMysql")
const md5 = require("md5")
const makeToken = require("./createToken")
const router = require('express').Router()

router.post("/api/user/auth", async (req,res)=>{
    let error = false
    let resultObj = {}
    let idUser = 0
    let moneyUser
    const body = req.body
    const login = body.login
    const password = body.password

    console.log("Авторизация ", body);

    if (!login || !password) {
        console.log("Request invalid");
        res.status(403).send("Request invalid")
        return
    }

    await new Promise((resolve)=>{
        console.log(`SELECT id, money FROM users WHERE login = '${login}' and password = '${md5(password)}'`);
        connection.query(`SELECT id, money FROM users WHERE login = '${login}' and password = '${md5(password)}'`, (err,result) => {
            if (err) {
                error = true
                resultObj.status = 500
                resultObj.error = "Server invalid"
                resolve()
            }
            if (result.length == 0) {
                console.log("login or password invalid");
                error = true
                resultObj.status = 403
                resultObj.error = "login or password invalid"
                resolve()
            } else {
                idUser = result[0].id
                moneyUser = result[0].money
                resultObj.status = 200
                resolve()
            }
        })
    })

    if (error) {
        res.status(resultObj.status).send(resultObj)
        return
    }

    const token = makeToken()

    await new Promise((resolve)=>{
        connection.query(`UPDATE users SET token = '${token}' WHERE (id = '${idUser}')`,(err,result) => {
            res.status(200).send({
                token : token,
                money : moneyUser
            })
            resolve()
        })
    })
})

module.exports = router