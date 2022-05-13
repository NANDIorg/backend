const connection = require("../../connectMysql")
const router = require('express').Router()

router.post("/api/dispute/closeDispute", async (req,res)=>{
    const idDispute = req.body.idDispute
    const sideWiner = req.body.winnerSide

    let a1 = 0
    let a2 = 0

    if (!idDispute || !sideWiner) {
        res.sendStatus(422)
        return
    }

    await new Promise ((resolve)=>{
        connection.query(`SELECT sum(disputbet.money) as sum, disputbet.who FROM distup
        JOIN disputbet ON disputbet.idDistup = distup.id
        WHERE distup.id = '${idDispute}'
        GROUP BY disputbet.who
        ORDER BY disputbet.who`,(err,result)=>{
            if (result.length == 2) {
                a1 = result[0].sum
                a2 = result[1].sum
            } else if (result.length == 1) {
                if (result[0].who == 1) {
                    a1 = result[0].sum
                } else {
                    a2 = result[0].sum
                }
            } else {
                a1 = 1
                a2 = 1
            }
            resolve()
        })
    })

    let x1 = 1/(a1/(a2+a1))
    let x2 = 1/(a2/(a2+a1))
    let x3 = 0
    if (sideWiner == 1) {
        x3 = x1
    } else {
        x3 = x2
    }

    let arrResult = []

    await new Promise((resolve)=>{
        connection.query(`SELECT disputbet.idUser, sum(disputbet.money) as moneyBet FROM distup
        JOIN disputbet ON disputbet.idDistup = distup.id and disputbet.who = '${sideWiner}'
        WHERE distup.id = '${idDispute}'
        Group by disputbet.idUser`, (err,result)=>{
            result.forEach(el => {
                arrResult.push({
                    id : el.idUser,
                    money : Number(el.moneyBet) * x3
                })
            })
            resolve()
        })
    })

    await new Promise ((resolve)=>{
        connection.query(`UPDATE distup SET vision = '0' WHERE (id = '${idDispute}')`,(err,result)=>{
            resolve()
        })
    })

    for (let i = 0; i < arrResult.length; i++) {
        const el = arrResult[i];
        let moneyUser = 0
        await new Promise((resolve)=>{
            connection.query(`SELECT * FROM users
            where id = '${el.id}'`,(err,result)=>{
                moneyUser = Number(result[0].money)
                resolve()
            })
        })

        await new Promise((resolve)=>{
            connection.query(`UPDATE users SET money = '${moneyUser+el.money}' WHERE (id = '${el.id}')`,(err,result)=>{
                resolve()
            })
        })
        console.log(el.id,moneyUser+el.money);
    }
    res.sendStatus(200)
})

module.exports = router