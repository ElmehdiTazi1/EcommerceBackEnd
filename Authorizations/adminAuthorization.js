class adminMiddleware {
    static admin(req, res, next) {

        if (req.user.role == 1)
            next()
        else
            res.status(401).send("no autorisation admin");



    }
}

module.exports = adminMiddleware.admin;