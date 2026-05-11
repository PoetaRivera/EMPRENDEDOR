const { z } = require("zod");

const checkAvailability = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().int().positive()
});

const updateStock = z.object({
  productoId: z.string().min(1),
  stock: z.number().int().min(0)
});

module.exports = { checkAvailability, updateStock };
