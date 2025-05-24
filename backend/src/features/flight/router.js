const express = require("express");
const controller = require("./controller");
const { authJWToken } = require("../../middleware/jwt");

const router = express.Router();

router.get("/", controller.getAllFlights);
router.post("/", authJWToken, controller.addFlight);
router.delete("/:id", authJWToken, controller.deleteFlight);

module.exports = router;
