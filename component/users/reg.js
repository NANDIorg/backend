const connection = require("../../connectMysql")
const md5 = require("md5")
const makeToken = require("./createToken")
const router = require('express').Router()

router.post("/api/user/reg", async (req,res)=>{
    let error = false
    let resultObj = {}
    const body = req.body
    const login = body.login
    const password = body.password

    if (!login || !password) {
        res.status(403).send("Request invalid")
        return
    }

    await new Promise((resolve)=>{
        connection.query(`SELECT id FROM users WHERE login = '${login}'`,(err,result)=>{
            if (err) {
                error = true
                resultObj.status = 500
                resultObj.error = "Server invalid"
                resolve()
            }
            if ( result.length > 0) {
                error = true
                resultObj.status = 403
                resultObj.error = "login invalid"
                resolve()
            } else {
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
        connection.query(`INSERT INTO users (login, password, token) VALUES ('${login}', '${md5(password)}', '${token}')`,(err,result)=>{
            res.send({
                token : token,
                money : 0
            })
            resolve()
        })
    })
    
})

module.exports = router