const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const cityRouter = require("./features/city/router");
const flightRouter = require("./features/flight/router");
const ticketRouter = require("./features/ticket/router");
const adminRouter = require("./features/admin/router");
const { authJWToken } = require("./middleware/jwt");

app.use("/api/v1/city", cityRouter);
app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/admin", adminRouter);

/*
app.use(
    "/assets",
    express.static(path.join(__dirname, "../../frontend/dist/assets"))
);
*/

const distPath = path.join(__dirname, "../../frontend/dist");
app.use("/assets", express.static(path.join(distPath, "assets")));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.get("/flight", (req, res) => {
    res.sendFile(path.join(distPath, "flight.html"));
});

app.get("/flight/:id", (req, res) => {
    res.sendFile(path.join(distPath, "flight.html"));
});

app.get("/admin/login", (req, res) => {
    if (req.cookies.jwtoken) {
        res.redirect("/admin/dashboard");
        return;
    }
    res.sendFile(path.join(distPath, "admin_login.html"));
});

app.get("/admin/dashboard", authJWToken, (req, res) => {
    res.sendFile(path.join(distPath, "admin_dashboard.html"));
});

app.get("/admin/flight/:id", authJWToken, (req, res) => {
    res.sendFile(path.join(distPath, "admin_flight.html"));
});

module.exports = app;
