const express = require("express");
const { checkAvailability, updateStock } = require("./inventory.controller");
const { validate } = require("../../shared/http/validate");
const { checkAvailability: checkSchema, updateStock: updateSchema } = require("./inventory.schema");

const inventoryRouter = express.Router();

inventoryRouter.post("/check", validate(checkSchema), checkAvailability);
inventoryRouter.post("/stock", validate(updateSchema), updateStock);

module.exports = { inventoryRouter };
