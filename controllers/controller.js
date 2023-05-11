class Controller {

    static home(req, res){
        res.render("home")
    }

    static registerForm(req, res){
        res.render("register-form")
    }

    static postRegister(req,res){
        res.send("post register")
    }

    static loginForm(req, res){
        res.render("login-form")
    }

    static postLogin(req,res){
        res.send("post login")
    }
}

module.exports = Controller