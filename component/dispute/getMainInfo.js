const connection = require("../../connectMysql")
const router = require('express').Router()

router.get("/api/dispute/getMainInfo", async (req, res)=>{
    const token = req.query.token
    const idDispute = req.query.idDispute
    let resultObj = {}
    let error = false

    await new Promise ((resolve)=>{
        connection.query(`SELECT * FROM distup
        WHERE distup.id = '${idDispute}'`,(err,result)=>{
            if (result.length == 0) error = true
            resolve()
        })
    })

    if (error) {
        res.sendStatus(403)
        return
    }

    await new Promise ((resolve)=>{
        connection.query(`SELECT distup.id FROM distup
        JOIN users ON users.token = '${token}' and distup.userCreated = users.id
        WHERE distup.id = '${idDispute}'`,(err,result)=>{
            if (result.length > 0) {
                resultObj.isCreated = true
            } else {
                resultObj.isCreated = false
            }
            resolve()
        })
    })

    await new Promise ((resolve)=>{
        connection.query(`SELECT * FROM distup
        WHERE distup.id = '${idDispute}'`,(err,result)=>{
            resultObj.id = result[0].id
            resultObj.title = result[0].title
            resultObj.team_one = result[0].teamOne
            resultObj.team_two = result[0].teamTwo
            resultObj.isBet = (result[0].isBet == 1) ? true : false
            resultObj.description = result[0].description
            resolve()
        })
    })

    await new Promise((resolve)=>{
        connection.query(`SELECT disputbet.id as id, disputbet.who as teamWho, sum(disputbet.money) as moneyBet, distup.title, distup.teamOne, distup.teamTwo FROM disputbet
        JOIN distup ON distup.id = disputbet.idDistup
        where disputbet.idDistup = '${idDispute}'
        GROUP BY disputbet.who
        ORDER BY disputbet.who`,(err,result)=>{
            if (result.length == 1) {
                if (result[0].teamWho == 1) {
                    let a1 = result[0].moneyBet
                    let a2 = 1
                    let x1 = 1/(a1/(a2+a1))
                    let x2 = 1/(a2/(a2+a1))
                    resultObj.team_two_bet_kof = x2.toFixed(2)
                    resultObj.team_one_bet_kof = x1.toFixed(2)
                    resultObj.team_two_bet = 0
                    resultObj.team_one_bet = a1
                } else {
                    let a1 = result[0].moneyBet
                    let a2 = 1
                    let x1 = 1/(a1/(a2+a1))
                    let x2 = 1/(a2/(a2+a1))
                    resultObj.team_two_bet_kof = x1.toFixed(2)
                    resultObj.team_one_bet_kof = x2.toFixed(2)
                    resultObj.team_two_bet = a1
                    resultObj.team_one_bet = 0
                }
            } else if (result.length == 2) {
                let a1 = result[0].moneyBet
                let a2 = result[1].moneyBet
                let x1 = 1/(a1/(a2+a1))
                let x2 = 1/(a2/(a2+a1))
                resultObj.team_two_bet_kof = x2.toFixed(2),
                resultObj.team_one_bet_kof = x1.toFixed(2)
                resultObj.team_two_bet = a2
                resultObj.team_one_bet = a1
            } else {
                resultObj.team_two_bet_kof = 1
                resultObj.team_one_bet_kof = 1
                resultObj.team_two_bet = 0
                resultObj.team_one_bet = 0
            }
            resolve()
        })
    })

    res.send(resultObj)
})

module.exports = router