const { getClient } = require("../../data/database");
const { v4: uuidv4 } = require("uuid");

exports.getAllTickets = async (req, res) => {
    const client = await getClient();
    let query = "SELECT * FROM ticket";
    const values = [];
    if (req.query?.flight_id) {
        query += " WHERE flight_id = $1";
        values.push(req.query?.flight_id);
    }
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

exports.addTicket = async (req, res) => {
    const client = await getClient();
    const { flight_id, passenger_name, passenger_surname, passenger_email } =
        req.body;

    // get the available seats for the flight
    try {
        const result = await client.query(
            "SELECT seats_available FROM flight WHERE id = $1",
            [flight_id]
        );
        // if no seats available, return an error
        if (result.rows[0].seats_available <= 0) {
            res.status(400).json({ error: "No available seats" });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    // insert the ticket into the database
    try {
        const result = await client.query(
            "INSERT INTO ticket (id, flight_id, passenger_name, passenger_surname, passenger_email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [
                uuidv4(),
                flight_id,
                passenger_name,
                passenger_surname,
                passenger_email,
            ]
        );
        await client.query(
            "UPDATE flight SET seats_available = seats_available - 1 WHERE id = $1",
            [flight_id]
        );
        res.status(200).json({ message: "Ticket added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};
