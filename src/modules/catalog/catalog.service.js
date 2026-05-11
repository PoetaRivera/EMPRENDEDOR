const { CatalogRepository } = require("./catalog.repository");

class CatalogService {
  constructor({ catalogRepository = new CatalogRepository() } = {}) {
    this.catalogRepository = catalogRepository;
  }

  listProducts({ clienteId, pagination }) {
    return this.catalogRepository.listProducts(clienteId, pagination);
  }

  createProduct({ clienteId, product }) {
    return this.catalogRepository.createProduct(clienteId, {
      ...product,
      createdAt: new Date().toISOString()
    });
  }
}

module.exports = { CatalogService };
