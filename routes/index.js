const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")
const {isLogin,isAdmin} = require("../helper/middleware")

router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)


router.use(isLogin)
router.get('/', Controller.home)
router.get('/doctors', Controller.showDoctors)
router.get("/user/:id", Controller.showUser)
router.get('/appointment/:DoctorId', Controller.appointmentGet)
router.post('/appointment/:DoctorId', Controller.appointmentPost)
router.get('/doctor/add',isAdmin, Controller.doctorAddGet)
router.post('/doctor/add',isAdmin, Controller.doctorAddPost)
router.get('/logout', Controller.logout)

module.exports = router