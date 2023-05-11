const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")
const {isLogin} = require("../helper/middleware")

router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)


router.use(isLogin)

router.get('/', Controller.home)
router.get('/appointment/:DoctorId', Controller.appointmentGet)
router.post('/appointment/:DoctorId', Controller.appointmentPost)
router.post('/logout', Controller.logout)

module.exports = router