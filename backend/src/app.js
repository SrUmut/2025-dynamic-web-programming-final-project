const express = require("express");
var cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const cityRouter = require("./features/city/router");
const flightRouter = require("./features/flight/router");
const ticketRouter = require("./features/ticket/router");
const adminRouter = require("./features/admin/router");

app.use(express.json());

app.use("/api/v1/city", cityRouter);
app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;
