const connection = require("../../connectMysql")
const router = require('express').Router()

router.post("/api/disput/createDisput", async (req,res) => {
    const token = req.body.token
    const title = req.body.name
    const teamOne = req.body.team_one
    const teamTwo = req.body.team_two
    const description = req.body.description
    let idUser = 0
    
    if (token == undefined || title == undefined || teamOne == undefined || teamTwo == undefined || description == undefined) {
        res.sendStatus(403)
        return
    }

    await new Promise((resolve)=>{
        connection.query(`SELECT id FROM users WHERE token = '${token}'`,(err,result)=>{
            idUser = result[0].id
            resolve()
        })
    })

    await new Promise((resolve)=>{
        connection.query(`INSERT INTO distup (title, description, teamOne, teamTwo, userCreated) VALUES ('${title}', '${description}', '${teamOne}', '${teamTwo}', '${idUser}')`,(req,res)=>{
            resolve()
        })
    })
})

module.exports = router