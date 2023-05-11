const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")

router.get('/', Controller.home)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)

module.exports = router