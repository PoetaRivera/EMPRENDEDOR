const express = require("express");
const { createOrder, listOrders } = require("./orders.controller");

const ordersRouter = express.Router();

ordersRouter.get("/", listOrders);
ordersRouter.post("/", createOrder);

module.exports = { ordersRouter };
