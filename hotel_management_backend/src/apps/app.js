const express = require("express");

const app = express();
const config = require("config");


// config router
app.use(require(config.get("app.router")));

module.exports = app;
