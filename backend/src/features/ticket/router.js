const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.getAllTickets);
router.post("/", controller.addTicket);

module.exports = router;
