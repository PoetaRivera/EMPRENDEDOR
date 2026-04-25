const express = require("express");
const { listBuyers, createBuyer } = require("./clients.controller");

const clientsRouter = express.Router();

clientsRouter.get("/buyers", listBuyers);
clientsRouter.post("/buyers", createBuyer);

module.exports = { clientsRouter };
