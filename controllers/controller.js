const {User} = require("../models")
const {backHashPassword} = require("../helper/bcrypt")

class Controller {

    static home(req, res){
        res.render("home")
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
}

module.exports = Controller