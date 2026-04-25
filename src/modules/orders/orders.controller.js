const { OrdersService } = require("./orders.service");

const ordersService = new OrdersService();

async function createOrder(req, res, next) {
  try {
    const order = await ordersService.createOrder({
      clienteId: req.tenant.clienteId,
      items: req.body.items || [],
      cliente: req.body.cliente,
      metodoPago: req.body.metodoPago
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

async function listOrders(req, res, next) {
  try {
    const orders = await ordersService.listOrders({
      clienteId: req.tenant.clienteId
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, listOrders };
