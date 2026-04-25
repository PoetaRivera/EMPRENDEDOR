const { BadRequestError } = require("../../shared/http/errors");
const { InventoryService } = require("../inventory/inventory.service");
const { PaymentsService } = require("../payments/payments.service");
const { OrdersRepository } = require("./orders.repository");

class OrdersService {
  constructor({
    ordersRepository = new OrdersRepository(),
    inventoryService = new InventoryService(),
    paymentsService = new PaymentsService()
  } = {}) {
    this.ordersRepository = ordersRepository;
    this.inventoryService = inventoryService;
    this.paymentsService = paymentsService;
  }

  async createOrder({ clienteId, items, cliente, metodoPago }) {
    for (const item of items) {
      const available = await this.inventoryService.checkDisponibilidad({
        clienteId,
        productoId: item.productoId,
        cantidad: item.cantidad
      });

      if (!available) {
        throw new BadRequestError(`Product ${item.productoId} is not available`);
      }
    }

    const order = await this.ordersRepository.createOrder(clienteId, {
      cliente,
      items,
      metodoPago,
      status: "created",
      createdAt: new Date().toISOString()
    });

    for (const item of items) {
      await this.inventoryService.descontarStock({
        clienteId,
        productoId: item.productoId,
        cantidad: item.cantidad
      });
    }

    const payment = await this.paymentsService.registerStatus({
      clienteId,
      orderId: order.id,
      status: "pending",
      metodoPago
    });

    return { ...order, payment };
  }

  listOrders({ clienteId }) {
    return this.ordersRepository.listOrders(clienteId);
  }
}

module.exports = { OrdersService };
