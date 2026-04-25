const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class ClientsRepository {
  constructor() {
    this.db = getFirestore();
  }

  async listBuyers(clienteId) {
    const snapshot = await tenantItemsCollection(this.db, "clients", clienteId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async createBuyer(clienteId, buyer) {
    const ref = await tenantItemsCollection(this.db, "clients", clienteId).add(buyer);
    return { id: ref.id, ...buyer };
  }
}

module.exports = { ClientsRepository };
