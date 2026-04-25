const { catalogRouter } = require("./catalog/catalog.routes");
const { inventoryRouter } = require("./inventory/inventory.routes");
const { ordersRouter } = require("./orders/orders.routes");
const { clientsRouter } = require("./clients/clients.routes");
const { paymentsRouter } = require("./payments/payments.routes");
const { authRouter } = require("./auth/auth.routes");

function registerModuleRoutes(app) {
  app.use("/api/catalog", catalogRouter);
  app.use("/api/inventory", inventoryRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/clients", clientsRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/auth", authRouter);
}

module.exports = { registerModuleRoutes };
