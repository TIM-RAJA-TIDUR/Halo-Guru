const { User ,Doctor, Division,Appointment} = require("../models")
const { formatter } = require("../helper/formatName")
const {Op} = require("sequelize")
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
        const {errors} = req.query;
        res.render("login-form", {errors})
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
        const {errors} = req.query;
        const {DoctorId} = req.params

        let options = {
            include: {
                model: Division
            }
        }

        Doctor.findByPk(DoctorId,options)
            .then(data => {
                res.render("appointment", {data, errors})
            })
            .catch(err => {
                res.send(err);
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
                let errors = []
            if(err.name === "SequelizeValidationError"){
                err.errors.forEach(el => {
                    errors.push(el.message)
                });
                res.redirect(`/appointment/${DoctorId}?errors=${err}`)
            }else{
                res.send(err)
            }
            })

    }
    
    static showDoctors(req,res){
        let { filter, search } =req.query;
        const options = {
            include: Division,
            order: [['id', 'asc']]
        }
        if(filter){
            options.where = {
                DivisionId: `${filter}`
            }
        }
        if(search){
            options.where = options.where || {};
            options.where.name = {[Op.iLike]: `%${search}%`};
        }
        let doctors;
        Doctor.findAll(options)
        .then(allDoctor => {
            doctors = allDoctor
            return Division.findAll()
        })
        .then(divisions => {
            res.render('doctors', {doctors, divisions, formatter})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static showUser(req,res){
        const {id} = req.params
        User.findByPk(id, {
            include: Profile
        })
        .then(user => {
            const title = User.genderName(user.Profile.gender)
            const fullName = `${title} ${user.name}`
            res.render('user', {user, fullName})
        })
        .catch(err => {
            res.send(err)
        })
    }  
}

module.exports = Controller