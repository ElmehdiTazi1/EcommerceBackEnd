class clientMiddleware {
    static client(req, res, next) {
              console.log(req.user)
        if (req.user.role == 3)
            next()
        else
            res.status(401).send("no autrisation client");



    }
}


module.exports = clientMiddleware.client;