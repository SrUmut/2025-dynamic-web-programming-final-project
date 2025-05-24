const { getClient } = require("../../data/database");
const { v4: uuidv4 } = require("uuid");

exports.getAllFlights = async (req, res) => {
    const client = await getClient();
    try {
        const result = await client.query("SELECT * FROM flight");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};

exports.addFlight = async (req, res) => {
    const client = await getClient();
    try {
        const {
            from_city,
            to_city,
            departure_time,
            arrival_time,
            price,
            seats_total,
        } = req.body;
        const departure_time_date = new Date(departure_time);
        const arrival_time_date = new Date(arrival_time);
        const result = await client.query(
            "INSERT INTO flight (id, from_city, to_city, departure_time, arrival_time, price, seats_total, seats_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                uuidv4(),
                from_city,
                to_city,
                departure_time_date.toISOString(),
                arrival_time_date.toISOString(),
                price,
                seats_total,
                seats_total,
            ]
        );
        res.send(result.rows);
    } catch (err) {
        if (err?.constraint === "unique_from_departure")
            res.status(400).json({
                error: "A flight with the same departure time from the same city already exists",
            });
        else if (err?.constraint === "unique_to_arrival")
            res.status(400).json({
                error: "A flight with the same arrival time to the same city already exists",
            });
        else {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    } finally {
        client.release();
    }
};

exports.deleteFlight = async (req, res) => {
    const client = await getClient();
    try {
        const result = await client.query("DELETE FROM flight WHERE id = $1", [
            req.params.id,
        ]);
        // if no rows deleted return an error
        if (result.rowCount === 0)
            res.status(400).json({
                error: `No flight with id ${req.params.id} exists`,
            });
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};
