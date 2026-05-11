const express = require("express");
const { registerStatus } = require("./payments.controller");
const { validate } = require("../../shared/http/validate");
const { registerStatus: registerStatusSchema } = require("./payments.schema");

const paymentsRouter = express.Router();

paymentsRouter.post("/status", validate(registerStatusSchema), registerStatus);

module.exports = { paymentsRouter };
