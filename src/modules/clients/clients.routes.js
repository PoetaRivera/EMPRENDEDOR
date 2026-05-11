const express = require("express");
const { listBuyers, createBuyer } = require("./clients.controller");
const { validate } = require("../../shared/http/validate");
const { createBuyer: createBuyerSchema } = require("./clients.schema");

const clientsRouter = express.Router();

clientsRouter.get("/buyers", listBuyers);
clientsRouter.post("/buyers", validate(createBuyerSchema), createBuyer);

module.exports = { clientsRouter };
