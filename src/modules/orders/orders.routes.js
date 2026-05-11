const express = require("express");
const { createOrder, listOrders } = require("./orders.controller");
const { validate } = require("../../shared/http/validate");
const { createOrder: createOrderSchema } = require("./orders.schema");

const ordersRouter = express.Router();

ordersRouter.get("/", listOrders);
ordersRouter.post("/", validate(createOrderSchema), createOrder);

module.exports = { ordersRouter };
