const connection = require("../../connectMysql")
const router = require('express').Router()

router.get("/api/dispute/getAllDispute", async (req,res) => {
    let arrayDistup = []
    let resultArray = []   

    console.log("getAllDispute");

    await new Promise((resolve)=>{
        connection.query(`SELECT * FROM distup WHERE vision = '1'`,(err,result)=>{
            result.forEach(el => {
                arrayDistup.push({
                    id : el.id,
                    title : el.title,
                    teamOne : el.teamOne,
                    teamTwo : el.teamTwo
                }) 
            });
            resolve()
        })
    })

    for (let i = 0; i < arrayDistup.length; i++) {
        const el = arrayDistup[i];
        await new Promise((resolve)=>{
            connection.query(`SELECT disputbet.id as id, disputbet.who as teamWho, sum(disputbet.money) as moneyBet, distup.title, distup.teamOne, distup.teamTwo FROM disputbet
            JOIN distup ON distup.id = disputbet.idDistup
            where disputbet.idDistup = '${el.id}'
            GROUP BY disputbet.who
            ORDER BY disputbet.who`,(err,result)=>{
                if (result.length == 1) {
                    if (result[0].teamWho == 1) {
                        let a1 = result[0].moneyBet
                        let a2 = 1
                        let x1 = 1/(a1/(a2+a1))
                        let x2 = 1/(a2/(a2+a1))
                        resultArray.push({
                            id : el.id,
                            name :  el.title,
                            team_one : el.teamOne,
                            team_two : el.teamTwo,
                            team_one_bet : x1.toFixed(2),
                            team_two_bet : x2.toFixed(2)
                        })
                    } else {
                        let a1 = result[0].moneyBet
                        let a2 = 1
                        let x1 = 1/(a1/(a2+a1))
                        let x2 = 1/(a2/(a2+a1))
                        resultArray.push({
                            id : el.id,
                            name :  el.title,
                            team_one : el.teamOne,
                            team_two : el.teamTwo,
                            team_one_bet : x2.toFixed(2),
                            team_two_bet : x1.toFixed(2)
                        })
                    }
                } else if (result.length == 2) {
                    let a1 = result[0].moneyBet
                    let a2 = result[1].moneyBet
                    let x1 = 1/(a1/(a2+a1))
                    let x2 = 1/(a2/(a2+a1))
                    resultArray.push({
                        id : el.id,
                        name :  el.title,
                        team_one : el.teamOne,
                        team_two : el.teamTwo,
                        team_two_bet : x2.toFixed(2),
                        team_one_bet : x1.toFixed(2)
                    })
                } else {
                    resultArray.push({
                        id : el.id,
                        name : el.title,
                        team_one : el.teamOne,
                        team_two : el.teamTwo,
                        team_two_bet : 1,
                        team_one_bet : 1
                    })
                }
                resolve()
            })
        })
    }
    
    res.send(resultArray)
})

module.exports = router