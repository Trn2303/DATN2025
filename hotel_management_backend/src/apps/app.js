const express = require("express");
const cookieParser = require("cookie-parser");
const { connectionRedis } = require("../common/init.redis");
const cors = require("cors");

connectionRedis();
const app = express();
const config = require("config");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/assets/uploads", express.static(config.get("app.baseImangeUrl")));

// config router
app.use(config.get("app.prefixApiVersion"), require(config.get("app.router")));

module.exports = app;
