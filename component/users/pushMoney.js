const connection = require("../../connectMysql")
const router = require('express').Router()

router.post("/api/user/pushMoney", async (req,res) =>{
    const token = req.body.token
    const money = req.body.money
    if (token == undefined) {
        res.sendStatus(403)
        return
    }
    if (!token) {
        res.sendStatus(403)
        return
    }
    let moneyUser = 0
    await new Promise((resolve)=>{
        connection.query(`SELECT money FROM users WHERE token = '${token}'`,(err,result)=>{
            moneyUser = result[0].money
            resolve()
        })
    })
    let pushMoney = Number(moneyUser) + Number(money)
    await new Promise((resolve)=>{
        connection.query(`UPDATE users SET money = '${pushMoney}' WHERE (token = '${token}')`,(err,result)=>{
            resolve()
        })
    })

    res.sendStatus(200)
})

module.exports = router