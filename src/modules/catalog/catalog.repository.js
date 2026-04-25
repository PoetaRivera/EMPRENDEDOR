const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class CatalogRepository {
  constructor() {
    this.db = getFirestore();
  }

  async listProducts(clienteId) {
    const snapshot = await tenantItemsCollection(this.db, "catalog", clienteId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async createProduct(clienteId, product) {
    const ref = await tenantItemsCollection(this.db, "catalog", clienteId).add(product);
    return { id: ref.id, ...product };
  }
}

module.exports = { CatalogRepository };
