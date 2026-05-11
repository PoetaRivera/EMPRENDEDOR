const { OrdersService } = require("../modules/orders/orders.service");

describe("OrdersService", () => {
  let ordersService;
  let mockOrdersRepo;
  let mockInventoryRepo;
  let mockPaymentsService;
  let mockDb;

  beforeEach(() => {
    mockOrdersRepo = {
      createOrderInTransaction: jest.fn(),
      listOrders: jest.fn().mockResolvedValue([])
    };

    mockInventoryRepo = {
      getItemInTransaction: jest.fn(),
      setItemInTransaction: jest.fn()
    };

    mockPaymentsService = {
      registerStatus: jest.fn()
    };

    mockDb = {
      runTransaction: jest.fn()
    };

    ordersService = new OrdersService({
      ordersRepository: mockOrdersRepo,
      inventoryRepository: mockInventoryRepo,
      paymentsService: mockPaymentsService
    });
    ordersService.db = mockDb;
  });

  it("crea una orden exitosamente cuando hay stock", async () => {
    mockInventoryRepo.getItemInTransaction.mockResolvedValue({ id: "inv1", productoId: "p1", stock: 10 });

    const createdOrder = { id: "order1", cliente: "Juan", items: [{ productoId: "p1", cantidad: 2 }], status: "created" };
    mockOrdersRepo.createOrderInTransaction.mockReturnValue(createdOrder);

    mockPaymentsService.registerStatus.mockResolvedValue({ id: "pay1", status: "pending" });

    mockDb.runTransaction.mockImplementation(async (fn) => {
      const t = {};
      return fn(t);
    });

    const result = await ordersService.createOrder({
      clienteId: "c1",
      items: [{ productoId: "p1", cantidad: 2 }],
      cliente: "Juan",
      metodoPago: "tarjeta"
    });

    expect(mockInventoryRepo.getItemInTransaction).toHaveBeenCalledTimes(1);
    expect(mockInventoryRepo.setItemInTransaction).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepo.createOrderInTransaction).toHaveBeenCalled();
    expect(mockPaymentsService.registerStatus).toHaveBeenCalled();
    expect(result.id).toBe("order1");
    expect(result.payment.status).toBe("pending");
  });

  it("lanza error si el producto no existe en inventario", async () => {
    mockInventoryRepo.getItemInTransaction.mockResolvedValue(null);

    mockDb.runTransaction.mockImplementation(async (fn) => {
      return fn({});
    });

    await expect(
      ordersService.createOrder({
        clienteId: "c1",
        items: [{ productoId: "inexistente", cantidad: 1 }],
        metodoPago: "tarjeta"
      })
    ).rejects.toThrow("not found in inventory");
  });

  it("lanza error si el stock es insuficiente", async () => {
    mockInventoryRepo.getItemInTransaction.mockResolvedValue({ id: "inv1", productoId: "p1", stock: 1 });

    mockDb.runTransaction.mockImplementation(async (fn) => {
      return fn({});
    });

    await expect(
      ordersService.createOrder({
        clienteId: "c1",
        items: [{ productoId: "p1", cantidad: 10 }],
        metodoPago: "tarjeta"
      })
    ).rejects.toThrow("insufficient stock");
  });

  it("la transaccion es atomica: no descuenta stock si falla la creacion de orden", async () => {
    mockInventoryRepo.getItemInTransaction.mockResolvedValue({ id: "inv1", productoId: "p1", stock: 10 });
    mockOrdersRepo.createOrderInTransaction.mockImplementation(() => {
      throw new Error("DB error");
    });

    mockDb.runTransaction.mockImplementation(async (fn) => {
      return fn({});
    });

    await expect(
      ordersService.createOrder({
        clienteId: "c1",
        items: [{ productoId: "p1", cantidad: 2 }],
        metodoPago: "tarjeta"
      })
    ).rejects.toThrow("DB error");

    expect(mockInventoryRepo.setItemInTransaction).toHaveBeenCalledTimes(1);
    expect(mockPaymentsService.registerStatus).not.toHaveBeenCalled();
  });
});
