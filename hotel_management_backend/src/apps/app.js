const express = require("express");

const app = express();
const config = require("config");

app.use(express.json());
app.use("/asset/uploads/images", express.static(config.get("app.baseImangeUrl")));

// config router
app.use(config.get("app.prefixApiVersion"), require(config.get("app.router")));

module.exports = app;
