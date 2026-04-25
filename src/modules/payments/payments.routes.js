const express = require("express");
const { registerStatus } = require("./payments.controller");

const paymentsRouter = express.Router();

paymentsRouter.post("/status", registerStatus);

module.exports = { paymentsRouter };
