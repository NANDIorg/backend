const router = require('express').Router()
const auth = require("./auth")
const reg = require("./reg")
const getMoney = require("./getMoney")
const pushMoney = require("./pushMoney")
const postBet = require("./postBet")

router.use(auth)
router.use(reg)
router.use(getMoney)
router.use(pushMoney)
router.use(postBet)



module.exports = router