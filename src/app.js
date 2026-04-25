const express = require("express");
const { tenantContextMiddleware } = require("./middleware/tenant-context.middleware");
const { errorHandler } = require("./shared/http/error-handler");
const { registerModuleRoutes } = require("./modules");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(tenantContextMiddleware);

  app.get("/health", (req, res) => {
    res.json({
      ok: true,
      service: "inventario-saas-modular",
      clienteId: req.tenant?.clienteId || null
    });
  });

  registerModuleRoutes(app);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
