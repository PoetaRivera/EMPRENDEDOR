const { BadRequestError } = require("../shared/http/errors");

function resolveClienteId(req) {
  const fromHeader = req.header("x-cliente-id");
  const fromQuery = req.query.clienteId;
  const host = req.hostname || "";
  const subdomain = host.split(".").length > 2 ? host.split(".")[0] : null;

  return fromHeader || fromQuery || subdomain || null;
}

function tenantContextMiddleware(req, res, next) {
  if (req.path === "/health") {
    return next();
  }

  const clienteId = resolveClienteId(req);

  if (!clienteId) {
    return next(new BadRequestError("clienteId is required"));
  }

  req.tenant = { clienteId };
  return next();
}

module.exports = { tenantContextMiddleware };
