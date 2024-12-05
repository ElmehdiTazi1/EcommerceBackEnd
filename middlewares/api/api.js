const jwt = require("jsonwebtoken");

const config = process.env;
class apiMiddleware {
    static api(req, res, next) {
        const token =
            req.body.apikey || req.query.apikey || req.headers["x-api-key"];

        if (!token) {
            return res.status(403).send("A token is required for api");
        }

        if (config.API_KEY != token);
        return res.status(403).send("A token is required for api");

        return next();
    };
}


module.exports = authMiddleware.api;