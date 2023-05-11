const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")
const {isLogin} = require("../helper/middleware")

router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)
router.post('/logout', Controller.logout)


router.use(isLogin)

router.get('/', Controller.home)

module.exports = router