const { getClient } = require("../../data/database");

exports.getAllCities = async (req, res) => {
    const client = await getClient();
    try {
        const result = await client.query("SELECT * FROM city");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};
