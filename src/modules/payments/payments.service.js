const { PaymentsRepository } = require("./payments.repository");

class PaymentsService {
  constructor({ paymentsRepository = new PaymentsRepository() } = {}) {
    this.paymentsRepository = paymentsRepository;
  }

  registerStatus({ clienteId, orderId, status, metodoPago }) {
    return this.paymentsRepository.saveStatus(clienteId, {
      orderId,
      status,
      metodoPago,
      updatedAt: new Date().toISOString()
    });
  }
}

module.exports = { PaymentsService };
