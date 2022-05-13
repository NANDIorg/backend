const connection = require("../../connectMysql")
const router = require('express').Router()

router.get("/api/user/getMoney", async (req,res) => {
    const token = req.headers.token

    if (!token) {
        res.sendStatus(403)
        return
    }
    
    console.log(`SELECT money FROM users WHERE token = '${token}'`);
    await new Promise ((resolve)=>{
        connection.query(`SELECT money FROM users WHERE token = '${token}'`,(err,result)=>{
            if (err) {
                res.sendStatus(422)
                resolve()
                return
            }
            console.log(result[0].money);
            res.status(200).send(result[0])
            resolve()
        })
    })
})

module.exports = router