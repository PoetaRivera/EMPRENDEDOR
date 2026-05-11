const { BadRequestError } = require("../../shared/http/errors");
const { getFirestore } = require("../../config/firebase");
const { InventoryRepository } = require("../inventory/inventory.repository");
const { PaymentsService } = require("../payments/payments.service");
const { OrdersRepository } = require("./orders.repository");

class OrdersService {
  constructor({
    ordersRepository = new OrdersRepository(),
    inventoryRepository = new InventoryRepository(),
    paymentsService = new PaymentsService()
  } = {}) {
    this.ordersRepository = ordersRepository;
    this.inventoryRepository = inventoryRepository;
    this.paymentsService = paymentsService;
    this.db = getFirestore();
  }

  async createOrder({ clienteId, items, cliente, metodoPago }) {
    const order = await this.db.runTransaction(async (t) => {
      for (const item of items) {
        const inv = await this.inventoryRepository.getItemInTransaction(t, clienteId, item.productoId);

        if (!inv) {
          throw new BadRequestError(`Product ${item.productoId} not found in inventory`);
        }

        const stock = Number(inv.stock || 0);
        if (stock < item.cantidad) {
          throw new BadRequestError(`Product ${item.productoId} has insufficient stock`);
        }

        this.inventoryRepository.setItemInTransaction(t, clienteId, {
          productoId: item.productoId,
          stock: stock - item.cantidad,
          updatedAt: new Date().toISOString()
        });
      }

      return this.ordersRepository.createOrderInTransaction(t, clienteId, {
        cliente,
        items,
        metodoPago,
        status: "created",
        createdAt: new Date().toISOString()
      });
    });

    const payment = await this.paymentsService.registerStatus({
      clienteId,
      orderId: order.id,
      status: "pending",
      metodoPago
    });

    return { ...order, payment };
  }

  listOrders({ clienteId, pagination }) {
    return this.ordersRepository.listOrders(clienteId, pagination);
  }
}

module.exports = { OrdersService };
