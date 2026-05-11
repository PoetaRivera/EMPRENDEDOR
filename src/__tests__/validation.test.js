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

    it("rechaza email invalido", () => {
      expect(() => createBuyer.parse({ nombre: "Juan", email: "no-es-email" })).toThrow(z.ZodError);
    });
  });

  describe("auth.login", () => {
    it("rechaza email invalido", () => {
      expect(() => login.parse({ email: "no-es-email" })).toThrow(z.ZodError);
    });
  });
});
