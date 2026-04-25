const { InventoryService } = require("./inventory.service");

const inventoryService = new InventoryService();

async function checkAvailability(req, res, next) {
  try {
    const available = await inventoryService.checkDisponibilidad({
      clienteId: req.tenant.clienteId,
      productoId: req.body.productoId,
      cantidad: req.body.cantidad
    });
    res.json({ available });
  } catch (error) {
    next(error);
  }
}

async function updateStock(req, res, next) {
  try {
    const item = await inventoryService.registerStock({
      clienteId: req.tenant.clienteId,
      productoId: req.body.productoId,
      stock: req.body.stock
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
}

module.exports = { checkAvailability, updateStock };
