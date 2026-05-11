const { z } = require("zod");

const createProduct = z.object({
  nombre: z.string().min(1),
  precio: z.number().positive(),
  stock: z.number().int().min(0).optional()
});

module.exports = { createProduct };
