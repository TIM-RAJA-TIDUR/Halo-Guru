const { User ,Doctor, Division,Appointment} = require("../models")
const { formatter } = require("../helper/formatName")
const {Op} = require("sequelize")
const {backHashPassword} = require("../helper/bcrypt")
const pdf = require('../node-pdf/index');

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
            let role = req.session.role
            res.render("home", {divisions,appointments,role})
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

        let htm_template = `<!DOCTYPE html>
        <html>
            <head>
                <mate charest="utf-8" />
                <title>Appointment</title>
            </head>
            <body>
                <h1>Appointment</h1>
                <ul>
                <li>Name: {{name}}</li>
                <li>Date: {{date}}</li>
                <li>Doctor: {{doctor}}</li>
                <li>Symptom: {{symtom}}</li>
                <br />
                </ul>
            </body>
        </html>`;
        var options = {
            format: 'A3',
            orientation: 'portrait',
            border: '10mm',
            header: {
                height: '45mm',
                contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            },
            footer: {
                height: '28mm',
                contents: {
                    first: 'Cover page',
                    2: 'Second page', 
                    default:
                        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                    last: 'Last Page'
                }
            }
        };
        let user
        Appointment.create({dateAppointment,symtomName,UserId,DoctorId})
            .then(_ => {
                return User.findByPk(UserId)
            })
            .then(user1 => {
                user = user1
                return Doctor.findByPk(DoctorId)
            })
            .then(doctor => {
                let doc = {
                    html: htm_template,
                    data: {
                        name: user.name,
                        date: dateAppointment,
                        doctor: doctor.name,
                        symtom: symtomName
                    },
                    type: 'pdf',
                    path: './output.pdf'
                };
                pdf(doc, options);
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

    static doctorAddGet(req, res){

        Division.findAll()
            .then(divisions => {
                res.render("formAddDoctor",{divisions})
            })
            .catch(err => {
                console.log(err);
            })
    }

    static doctorAddPost(req, res){

        const {name ,DivisionId} = req.body
        Doctor.create({name ,DivisionId})
        .then(_ => {
            res.redirect("/")
        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = Controller