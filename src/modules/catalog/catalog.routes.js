const express = require("express");
const { listProducts, createProduct } = require("./catalog.controller");
const { validate } = require("../../shared/http/validate");
const { createProduct: createProductSchema } = require("./catalog.schema");

const catalogRouter = express.Router();

catalogRouter.get("/products", listProducts);
catalogRouter.post("/products", validate(createProductSchema), createProduct);

module.exports = { catalogRouter };
