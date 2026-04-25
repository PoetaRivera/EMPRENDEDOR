const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class InventoryRepository {
  constructor() {
    this.db = getFirestore();
  }

  async getItemByProductId(clienteId, productoId) {
    const snapshot = await tenantItemsCollection(this.db, "inventory", clienteId)
      .where("productoId", "==", productoId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async upsertMovement(clienteId, payload) {
    const ref = tenantItemsCollection(this.db, "inventory", clienteId).doc(payload.productoId);
    await ref.set(payload, { merge: true });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = { InventoryRepository };
