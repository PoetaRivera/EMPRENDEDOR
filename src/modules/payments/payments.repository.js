const { getFirestore } = require("../../config/firebase");
const { tenantItemsCollection } = require("../../shared/firestore/collection-paths");

class PaymentsRepository {
  constructor() {
    this.db = getFirestore();
  }

  async saveStatus(clienteId, payment) {
    const paymentId = payment.orderId || payment.id;
    const ref = tenantItemsCollection(this.db, "payments", clienteId).doc(paymentId);
    await ref.set(payment, { merge: true });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = { PaymentsRepository };
