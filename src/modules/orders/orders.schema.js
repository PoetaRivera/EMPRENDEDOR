const { z } = require("zod");

const orderItem = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().int().positive()
});

const createOrder = z.object({
  items: z.array(orderItem).min(1),
  cliente: z.string().min(1).optional(),
  metodoPago: z.string().min(1)
});

module.exports = { createOrder };
