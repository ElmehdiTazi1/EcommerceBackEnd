const jwt = require("jsonwebtoken");

const config = process.env;
class guestMiddleware {
    static guest(req, res, next) {
        const token =req.cookies.token;

        if (!token) {
            return next();
        }
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            req.user = decoded;

        } catch (err) {
            return next();
           
        }
        res.redirect("/");
    
}
}


module.exports = guestMiddleware.guest;