const { z } = require("zod");

const receptorCCF = z.object({
  nit: z.string().min(1),
  nrc: z.string().min(1),
  razonSocial: z.string().min(1),
  direccion: z.string().min(1)
});

const receptorFCF = z.object({
  nombre: z.string().min(1)
});

const emisor = z.object({
  nit: z.string().min(1),
  nrc: z.string().min(1),
  razonSocial: z.string().min(1),
  direccion: z.string().min(1),
  giro: z.string().min(1)
});

const factura = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("CCF"),
    emisor: emisor,
    receptor: receptorCCF
  }),
  z.object({
    tipo: z.literal("FCF"),
    emisor: emisor,
    receptor: receptorFCF
  })
]).optional();

const orderItem = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().int().positive()
});

const createOrder = z.object({
  items: z.array(orderItem).min(1),
  cliente: z.string().min(1).optional(),
  metodoPago: z.string().min(1),
  factura: factura
});

module.exports = { createOrder, factura, receptorCCF, receptorFCF, emisor };
