const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.getAllCities);

module.exports = router;
