const express = require("express");
const { login } = require("./auth.controller");
const { validate } = require("../../shared/http/validate");
const { login: loginSchema } = require("./auth.schema");

const authRouter = express.Router();

authRouter.post("/login", validate(loginSchema), login);

module.exports = { authRouter };
