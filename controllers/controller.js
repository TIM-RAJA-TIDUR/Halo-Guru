const {User,Doctor, Division,Appointment} = require("../models")
const {backHashPassword} = require("../helper/bcrypt")

class Controller {

    static home(req, res){

        let option1 = {
            include:{
                model:Doctor
            }
        }

        let option2 = {
            where:{
                id:req.session.userId
            },
            include:{
                model: Doctor
            }
        }

        let divisions = []
        Division.findAll(option1)
        .then((data)=> {
            divisions = data
            return User.findOne(option2)
        })
        .then(appointments => {
            res.render("home", {divisions,appointments})
        })
        .catch(err => {
            console.log(err);
        })
        
        
    }

    static registerForm(req, res){
        res.render("register-form")
    }

    static postRegister(req,res){
        const {name, email, password ,role} = req.body

        User.create({name, email, password ,role})
            .then(()=> {
                res.redirect("/login")
            })
            .catch(err => {
                console.log(err);
                res.redirect(`/register?errors=${err}`)
            })
    }

    static loginForm(req, res){
        res.render("login-form")
    }

    static postLogin(req,res){
        const {email, password} = req.body

        let options = {
            where: {
                email
            }
        }

        User.findOne(options)
        .then((user)=> {
            if (user) {
                let isValidPassword = backHashPassword(password, user.password);

                if (isValidPassword) {

                    req.session.userId = user.id
                    req.session.name = user.name
                    req.session.role = user.role
                    res.redirect("/")
                }else{
                    throw new Error("password/username yang di masukan salah")
                }
            }else{
                throw new Error("login gagal")
            }
        })
        .catch(err => {
            res.redirect(`/login?errors=${err}`)
        })
    }

    static logout(req, res){
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            }else{
                res.redirect("/login")
            }
        })
    }

    static appointmentGet(req, res){

        const {DoctorId} = req.params

        let options = {
            include: {
                model: Division
            }
        }

        Doctor.findByPk(DoctorId,options)
            .then(data => {
                res.render("appointment", {data})
            })
            .catch(err => {
                console.log(err);
            })
        

    }

    static appointmentPost(req, res){
        const {DoctorId} = req.params
        const UserId = req.session.userId
        const {dateAppointment,symtomName} = req.body

        Appointment.create({dateAppointment,symtomName,UserId,DoctorId})
            .then(_ => {
                res.redirect("/")
            })
            .catch(err => {
                console.log(err);
            })

    }

    
}

module.exports = Controller