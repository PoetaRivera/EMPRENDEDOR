const { CatalogService } = require("./catalog.service");
const { getPagination } = require("../../shared/http/pagination");

const catalogService = new CatalogService();

async function listProducts(req, res, next) {
  try {
    const products = await catalogService.listProducts({
      clienteId: req.tenant.clienteId,
      pagination: getPagination(req.query)
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await catalogService.createProduct({
      clienteId: req.tenant.clienteId,
      product: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, createProduct };
