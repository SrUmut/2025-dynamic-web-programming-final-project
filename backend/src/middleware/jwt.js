const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function authJWToken(req, res, next) {
    const token = req.cookies?.jwtoken;

    if (!token) {
        return res
            .status(400)
            .json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        next();
    });
}

module.exports = { authJWToken };
