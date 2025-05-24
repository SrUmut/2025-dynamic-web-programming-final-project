const { getClient } = require("../../data/database");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { generateToken } = require("../../utils/jwt");

exports.login = async (req, res) => {
    const client = await getClient();
    try {
        const { username, password } = req.body;
        const result = await client.query(
            "SELECT * FROM admin WHERE username = $1",
            [username]
        );
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const passwordCheck = await verifyPassword(password, user.password);
        // if paswords dont match return an error
        if (!passwordCheck)
            res.status(401).json({ error: "Invalid username or password" });

        // generete the json web token
        const token = generateToken({ username: user.username });
        const expires = new Date(
            Date.now() +
                parseInt(process.env.JWT_COOKIE_EXP_DUR) * 60 * 60 * 1000
        );
        res.status(200)
            .cookie("jwtoken", token, { expires: expires, httponly: true })
            .json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};

exports.addAdmin = async (req, res) => {
    const client = await getClient();
    try {
        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const result = await client.query(
            "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        );
        res.send(result.rows);
    } catch (err) {
        if (err?.constraint === "admin_pkey")
            res.status(400).json({ error: "Username is taken" });
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};
