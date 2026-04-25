const express = require("express");
const { checkAvailability, updateStock } = require("./inventory.controller");

const inventoryRouter = express.Router();

inventoryRouter.post("/check", checkAvailability);
inventoryRouter.post("/stock", updateStock);

module.exports = { inventoryRouter };
