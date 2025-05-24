const bcrypt = require("bcrypt");

const saltRounds = 10;

async function hashPassword(plainPassword) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

async function verifyPassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (err) {
        console.error("Error verifying password:", err);
        throw err;
    }
}

module.exports = { hashPassword, verifyPassword };
