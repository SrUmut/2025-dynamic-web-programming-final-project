const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.JWT_EXP_DUR;

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRATION,
    });
}

module.exports = { generateToken };
