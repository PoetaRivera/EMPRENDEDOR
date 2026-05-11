const { z } = require("zod");

const registerStatus = z.object({
  orderId: z.string().min(1),
  status: z.string().min(1),
  metodoPago: z.string().min(1)
});

module.exports = { registerStatus };
