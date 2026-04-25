const express = require("express");
const { listProducts, createProduct } = require("./catalog.controller");

const catalogRouter = express.Router();

catalogRouter.get("/products", listProducts);
catalogRouter.post("/products", createProduct);

module.exports = { catalogRouter };
