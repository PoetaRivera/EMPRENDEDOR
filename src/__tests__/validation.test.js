const { z } = require("zod");
const { createProduct } = require("../modules/catalog/catalog.schema");
const { checkAvailability, updateStock } = require("../modules/inventory/inventory.schema");
const { createOrder } = require("../modules/orders/orders.schema");
const { createBuyer } = require("../modules/clients/clients.schema");
const { login } = require("../modules/auth/auth.schema");

describe("Validation schemas", () => {
  describe("catalog.createProduct", () => {
    it("acepta un producto valido", () => {
      expect(() => createProduct.parse({ nombre: "Laptop", precio: 999 })).not.toThrow();
    });

    it("rechaza precio negativo", () => {
      expect(() => createProduct.parse({ nombre: "X", precio: -1 })).toThrow(z.ZodError);
    });

    it("rechaza nombre vacio", () => {
      expect(() => createProduct.parse({ nombre: "", precio: 10 })).toThrow(z.ZodError);
    });
  });

  describe("inventory.checkAvailability", () => {
    it("rechaza cantidad negativa", () => {
      expect(() => checkAvailability.parse({ productoId: "p1", cantidad: -1 })).toThrow(z.ZodError);
    });

    it("rechaza cantidad cero", () => {
      expect(() => checkAvailability.parse({ productoId: "p1", cantidad: 0 })).toThrow(z.ZodError);
    });
  });

  describe("inventory.updateStock", () => {
    it("rechaza stock negativo", () => {
      expect(() => updateStock.parse({ productoId: "p1", stock: -5 })).toThrow(z.ZodError);
    });

    it("acepta stock cero", () => {
      expect(() => updateStock.parse({ productoId: "p1", stock: 0 })).not.toThrow();
    });
  });

  describe("orders.createOrder", () => {
    it("rechaza items vacios", () => {
      expect(() => createOrder.parse({ items: [], metodoPago: "tarjeta" })).toThrow(z.ZodError);
    });

    it("rechaza cantidad negativa en item", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: -2 }],
        metodoPago: "tarjeta"
      })).toThrow(z.ZodError);
    });

    it("acepta orden valida", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 3 }],
        metodoPago: "tarjeta"
      })).not.toThrow();
    });
  });

  describe("clients.createBuyer", () => {
    it("rechaza nombre vacio", () => {
      expect(() => createBuyer.parse({ nombre: "" })).toThrow(z.ZodError);
    });

    it("acepta datos fiscales completos", () => {
      expect(() => createBuyer.parse({
        nombre: "Empresa SA",
        facturacion: { habilitada: true, tipoPreferido: "CCF" },
        datosFiscales: {
          nit: "0614-123456-789-0",
          nrc: "12345-6",
          razonSocial: "Empresa SA de CV",
          direccion: "Calle X, San Salvador"
        }
      })).not.toThrow();
    });

    it("acepta facturacion habilitada sin datos fiscales", () => {
      expect(() => createBuyer.parse({
        nombre: "Juan",
        facturacion: { habilitada: true }
      })).not.toThrow();
    });
  });

  describe("orders.factura", () => {
    const emisor = {
      nit: "0614-111111-111-1",
      nrc: "11111-1",
      razonSocial: "Mi Empresa SA",
      direccion: "San Salvador",
      giro: "Comercio"
    };

    it("acepta factura CCF con receptor completo", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia",
        factura: {
          tipo: "CCF",
          emisor,
          receptor: {
            nit: "0614-999999-999-9",
            nrc: "99999-9",
            razonSocial: "Cliente SA",
            direccion: "Santa Ana"
          }
        }
      })).not.toThrow();
    });

    it("rechaza CCF sin NIT del receptor", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia",
        factura: {
          tipo: "CCF",
          emisor,
          receptor: { razonSocial: "Cliente SA", direccion: "Calle X" }
        }
      })).toThrow(z.ZodError);
    });

    it("acepta factura FCF con solo nombre del receptor", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia",
        factura: {
          tipo: "FCF",
          emisor,
          receptor: { nombre: "Consumidor Final" }
        }
      })).not.toThrow();
    });

    it("rechaza FCF sin nombre del receptor", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia",
        factura: {
          tipo: "FCF",
          emisor,
          receptor: {}
        }
      })).toThrow(z.ZodError);
    });

    it("acepta orden sin factura", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia"
      })).not.toThrow();
    });

    it("rechaza tipo de factura invalido", () => {
      expect(() => createOrder.parse({
        items: [{ productoId: "p1", cantidad: 1 }],
        metodoPago: "transferencia",
        factura: {
          tipo: "OTRO",
          emisor,
          receptor: {}
        }
      })).toThrow(z.ZodError);
    });
  });

  describe("auth.login", () => {
    it("rechaza email invalido", () => {
      expect(() => login.parse({ email: "no-es-email" })).toThrow(z.ZodError);
    });
  });
});
