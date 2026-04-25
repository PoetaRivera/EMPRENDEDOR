const { PaymentsService } = require("./payments.service");

const paymentsService = new PaymentsService();

async function registerStatus(req, res, next) {
  try {
    const payment = await paymentsService.registerStatus({
      clienteId: req.tenant.clienteId,
      orderId: req.body.orderId,
      status: req.body.status,
      metodoPago: req.body.metodoPago
    });
    res.json(payment);
  } catch (error) {
    next(error);
  }
}

module.exports = { registerStatus };
