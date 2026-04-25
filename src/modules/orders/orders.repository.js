const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class OrdersRepository {
  constructor() {
    this.db = getFirestore();
  }

  async createOrder(clienteId, order) {
    const ref = await tenantItemsCollection(this.db, "orders", clienteId).add(order);
    return { id: ref.id, ...order };
  }

  async listOrders(clienteId) {
    const snapshot = await tenantItemsCollection(this.db, "orders", clienteId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = { OrdersRepository };
