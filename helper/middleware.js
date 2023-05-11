const isLogin = (req, res, next) => {
    if (req.session.userId) {
        next()
    }else{
        res.redirect("/login?message=login dulu ya")
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.role == "Admin") {
        next()
    }else{
        res.redirect("/?errors=kamu bukan Admin")
    }
}

module.exports = {isLogin, isAdmin}