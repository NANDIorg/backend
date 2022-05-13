const route = require('express').Router()
const getDispute = require('./getDispute')
const createDistupe = require('./createDistupe')
const getMainInfo = require('./getMainInfo')
const closeDisput = require('./closeDisput')

route.use(getDispute)
route.use(createDistupe)
route.use(getMainInfo)
route.use(closeDisput)

module.exports = route