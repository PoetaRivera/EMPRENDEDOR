const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class ClientsRepository {
  constructor() {
    this.db = getFirestore();
  }

  async listBuyers(clienteId, { limit, offset } = {}) {
    let query = tenantItemsCollection(this.db, "clients", clienteId);
    if (offset) query = query.offset(offset);
    if (limit) query = query.limit(limit);
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async createBuyer(clienteId, buyer) {
    const ref = await tenantItemsCollection(this.db, "clients", clienteId).add(buyer);
    return { id: ref.id, ...buyer };
  }
}

module.exports = { ClientsRepository };
