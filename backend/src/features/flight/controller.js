const { getClient } = require("../../data/database");
const { v4: uuidv4 } = require("uuid");

exports.getAllFlights = async (req, res) => {
    let query = "SELECT * FROM flights";
    const conditions = [];
    const values = [];
    if (req.query?.from_city) {
        values.push(req.query.from_city);
        conditions.push(`from_city = $${values.length}`);
    }
    if (req.query?.to_city) {
        values.push(req.query.to_city);
        conditions.push(`to_city = $${values.length}`);
    }
    if (req.query?.date) {
        values.push(req.query.date);
        conditions.push(`DATE(departure_time) >= $${values.length}`);
    }

    if (values.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    const client = await getClient();
    try {
        const result = await client.query(query, values);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};

exports.getFlightById = async (req, res) => {
    const id = req.params.id;
    const client = await getClient();
    try {
        const result = await client.query(
            "SELECT * FROM flight WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Flight not found" });
        } else {
            res.send(result.rows[0]);
        }
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
        const { id } = req.body;
        const result = await client.query("DELETE FROM flight WHERE id = $1", [
            id,
        ]);
        // if no rows deleted return an error
        if (result.rowCount === 0) {
            res.status(400).json({
                error: `No flight with id ${req.params.id} exists`,
            });
        }
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

exports.updateFlight = async (req, res) => {
    const client = await getClient();
    try {
        const { id, from_city, to_city, price, departure_time, arrival_time } =
            req.body;
        const result = await client.query(
            "UPDATE flight SET from_city = $1, to_city = $2, price = $3, departure_time = $4, arrival_time = $5 WHERE id = $6",
            [from_city, to_city, price, departure_time, arrival_time, id]
        );
        if (result.rowCount === 0) {
            res.status(400).json({
                error: `No flight with id ${req.params.id} exists`,
            });
        }
        res.status(200).json({ message: "Flight updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};
