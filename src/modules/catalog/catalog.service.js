const { CatalogRepository } = require("./catalog.repository");

class CatalogService {
  constructor({ catalogRepository = new CatalogRepository() } = {}) {
    this.catalogRepository = catalogRepository;
  }

  listProducts({ clienteId }) {
    return this.catalogRepository.listProducts(clienteId);
  }

  createProduct({ clienteId, product }) {
    return this.catalogRepository.createProduct(clienteId, {
      ...product,
      createdAt: new Date().toISOString()
    });
  }
}

module.exports = { CatalogService };
