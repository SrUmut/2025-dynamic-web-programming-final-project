const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.post("/", controller.addAdmin);
router.post("/login", controller.login);

module.exports = router;
