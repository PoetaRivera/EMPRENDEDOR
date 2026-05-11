const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class OrdersRepository {
  constructor() {
    this.db = getFirestore();
  }

  createOrderInTransaction(t, clienteId, order) {
    const ref = tenantItemsCollection(this.db, "orders", clienteId).doc();
    t.set(ref, order);
    return { id: ref.id, ...order };
  }

  async listOrders(clienteId, { limit, offset } = {}) {
    let query = tenantItemsCollection(this.db, "orders", clienteId);
    if (offset) query = query.offset(offset);
    if (limit) query = query.limit(limit);
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = { OrdersRepository };
