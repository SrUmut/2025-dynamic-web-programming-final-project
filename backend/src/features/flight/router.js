const express = require("express");
const controller = require("./controller");
const { authJWToken } = require("../../middleware/jwt");

const router = express.Router();

router.get("/", controller.getAllFlights);
router.get("/:id", controller.getFlightById);
router.post("/", authJWToken, controller.addFlight);
router.delete("/", authJWToken, controller.deleteFlight);
router.put("/", authJWToken, controller.updateFlight);

module.exports = router;
