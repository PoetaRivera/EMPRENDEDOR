const request = require("supertest");
const { createApp } = require("../app");

jest.mock("../config/firebase", () => {
  const chain = {
    add: jest.fn().mockResolvedValue({ id: "mock-id" }),
    set: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue({ empty: true, docs: [] })
  };
  chain.collection = jest.fn().mockReturnValue(chain);
  chain.doc = jest.fn().mockReturnValue(chain);
  chain.where = jest.fn().mockReturnValue(chain);
  chain.limit = jest.fn().mockReturnValue(chain);
  chain.offset = jest.fn().mockReturnValue(chain);
  return {
    getFirestore: jest.fn(() => chain),
    getFirebaseApp: jest.fn()
  };
});

describe("API integration", () => {
  let app;
  let token;

  beforeEach(() => {
    app = createApp();
  });

  const loginAndGetToken = async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("x-cliente-id", "c1")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    return res.body.accessToken;
  };

  describe("GET /health", () => {
    it("retorna 200 sin autenticacion", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });

  describe("POST /api/auth/login", () => {
    it("genera un token sin requerir autenticacion previa", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("x-cliente-id", "c1")
        .send({ email: "test@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeTruthy();
      expect(res.body.user.email).toBe("test@test.com");
    });

    it("rechaza email invalido", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("x-cliente-id", "c1")
        .send({ email: "no-email" });

      expect(res.status).toBe(400);
    });
  });

  describe("endpoints protegidos", () => {
    it("requieren token de autorizacion", async () => {
      const res = await request(app)
        .get("/api/catalog/products")
        .set("x-cliente-id", "c1");

      expect(res.status).toBe(401);
    });

    it("rechazan token invalido", async () => {
      const res = await request(app)
        .get("/api/catalog/products")
        .set("x-cliente-id", "c1")
        .set("authorization", "Bearer token-falso");

      expect(res.status).toBe(401);
    });

    it("aceptan token valido", async () => {
      token = await loginAndGetToken();

      const res = await request(app)
        .get("/api/catalog/products")
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("validacion de inputs en endpoints", () => {
    beforeEach(async () => {
      token = await loginAndGetToken();
    });

    it("rechaza crear producto sin nombre", async () => {
      const res = await request(app)
        .post("/api/catalog/products")
        .set("authorization", `Bearer ${token}`)
        .send({ precio: 100 });

      expect(res.status).toBe(400);
    });

    it("rechaza orden sin items", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("authorization", `Bearer ${token}`)
        .send({ items: [], metodoPago: "tarjeta" });

      expect(res.status).toBe(400);
    });

    it("rechaza checkAvailability con cantidad negativa", async () => {
      const res = await request(app)
        .post("/api/inventory/check")
        .set("authorization", `Bearer ${token}`)
        .send({ productoId: "p1", cantidad: -5 });

      expect(res.status).toBe(400);
    });
  });
});
