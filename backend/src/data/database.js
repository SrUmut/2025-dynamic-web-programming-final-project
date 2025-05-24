// backend/src/db/client.js
const { Pool } = require("pg");

const pool = new Pool();

async function getClient() {
    return await pool.connect();
}

module.exports = {
    getClient,
};
