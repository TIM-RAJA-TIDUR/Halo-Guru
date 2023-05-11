const isLogin = (req, res, next) => {
    if (req.session.userId) {
        next()
    }else{
        res.redirect("/login?message=login dulu ya")
    }
}

module.exports = {isLogin}