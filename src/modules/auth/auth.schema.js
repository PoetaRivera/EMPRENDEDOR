const { z } = require("zod");

const login = z.object({
  email: z.string().email()
});

module.exports = { login };
