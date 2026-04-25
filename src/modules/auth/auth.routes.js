const express = require("express");
const { login } = require("./auth.controller");

const authRouter = express.Router();

authRouter.post("/login", login);

module.exports = { authRouter };
