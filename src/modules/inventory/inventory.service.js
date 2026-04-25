const { BadRequestError, NotFoundError } = require("../../shared/http/errors");
const { InventoryRepository } = require("./inventory.repository");

class InventoryService {
  constructor({ inventoryRepository = new InventoryRepository() } = {}) {
    this.inventoryRepository = inventoryRepository;
  }

  async checkDisponibilidad({ clienteId, productoId, cantidad }) {
    const item = await this.inventoryRepository.getItemByProductId(clienteId, productoId);
    if (!item) {
      return false;
    }

    return Number(item.stock || 0) >= Number(cantidad || 0);
  }

  async descontarStock({ clienteId, productoId, cantidad }) {
    const item = await this.inventoryRepository.getItemByProductId(clienteId, productoId);

    if (!item) {
      throw new NotFoundError("Inventory item not found");
    }

    const stockActual = Number(item.stock || 0);
    const cantidadSolicitada = Number(cantidad || 0);

    if (stockActual < cantidadSolicitada) {
      throw new BadRequestError("Insufficient stock");
    }

    return this.inventoryRepository.upsertMovement(clienteId, {
      ...item,
      productoId,
      stock: stockActual - cantidadSolicitada,
      updatedAt: new Date().toISOString()
    });
  }

  async registerStock({ clienteId, productoId, stock }) {
    return this.inventoryRepository.upsertMovement(clienteId, {
      productoId,
      stock: Number(stock || 0),
      updatedAt: new Date().toISOString()
    });
  }
}

module.exports = { InventoryService };
