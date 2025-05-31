const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function authJWToken(req, res, next) {
    const token = req.cookies?.jwtoken;

    if (!token) {
        return res.redirect("/admin/login");
    }

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            res.redirect("/admin/login");
        }

        next();
    });
}

module.exports = { authJWToken };
