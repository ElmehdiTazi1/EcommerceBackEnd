const jwt = require("jsonwebtoken");

const config = process.env;
class authMiddleware {
    static auth(req, res, next) {
        const token =req.cookies.token;

        if (!token) {
            res.redirect('/login')
            return;
        }
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            req.user = decoded;

        } catch (err) {
            res.redirect(200,"/login");
        }
        return next();
    
}
}


module.exports = authMiddleware.auth;