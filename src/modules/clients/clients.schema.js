const { z } = require("zod");

const datosFiscales = z.object({
  nit: z.string().min(1),
  nrc: z.string().min(1),
  razonSocial: z.string().min(1),
  direccion: z.string().min(1)
}).optional();

const facturacion = z.object({
  habilitada: z.boolean(),
  tipoPreferido: z.enum(["CCF", "FCF"]).optional()
}).optional();

const createBuyer = z.object({
  nombre: z.string().min(1),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  facturacion: facturacion,
  datosFiscales: datosFiscales
});

module.exports = { createBuyer, datosFiscales, facturacion };
