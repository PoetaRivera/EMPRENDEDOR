const { z } = require("zod");

const createBuyer = z.object({
  nombre: z.string().min(1),
  email: z.string().email().optional(),
  telefono: z.string().optional()
});

module.exports = { createBuyer };
