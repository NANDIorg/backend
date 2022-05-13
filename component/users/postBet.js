const connection = require("../../connectMysql")
const router = require('express').Router()

router.post("/api/postBET", async (req, res) => {
    const token = req.body.token
    const idDispute = req.body.idDispute
    const bet = req.body.bet
    const whoBet = req.body.side

    console.log(req.body);

    if (!token || !idDispute || !bet || !whoBet) {
        res.status(403).send("Invalid data")
        return
    }

    let moneyUser = 0
    let idUser = 0
    let error = false

    await new Promise ((resolve)=>{
        connection.query(`SELECT * FROM users
        where token = '${token}'`, (err, result)=>{
            if (result.length == 0) {
                error = true
                resolve()
                return
            }
            moneyUser = result[0].money
            idUser = result[0].id
            resolve()
        })
    })

    if (error) {
        res.status(403).send('Invalid token')
        return
    }

    if (moneyUser < bet) {
        res.status(403).send('Invalid bet')
        return
    }

    await new Promise ((resolve)=>{
        connection.query(`SELECT * FROM distup
        WHERE id = '${idDispute}'`,(err,result)=>{
            if (result.length == 0) {
                error = true
                resolve()
                return
            }
            resolve()
        })
    })

    if (error) {
        res.status(403).send('Invalid id dispute')
        return
    }

    await new Promise ((resolve)=>{
        connection.query(`UPDATE users SET money = '${moneyUser - bet}' WHERE (id = '${idUser}')`, (err,result) => {
            resolve()
        })
    })

    await new Promise ((resolve)=>{
        connection.query(`INSERT INTO disputbet (idUser,money, who, idDistup) VALUES ('${idUser}', '${bet}', '${whoBet}', '${idDispute}')`,(err,result)=>{
            resolve()
        })
    })
    res.sendStatus(200)
})

module.exports = router