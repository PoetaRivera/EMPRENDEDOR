const { InventoryService } = require("../modules/inventory/inventory.service");

describe("InventoryService", () => {
  let inventoryService;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      getItemByProductId: jest.fn(),
      upsertMovement: jest.fn(),
      getItemRef: jest.fn(),
      getItemInTransaction: jest.fn(),
      setItemInTransaction: jest.fn()
    };
    inventoryService = new InventoryService({ inventoryRepository: mockRepo });
  });

  describe("checkDisponibilidad", () => {
    it("retorna true si hay stock suficiente", async () => {
      mockRepo.getItemByProductId.mockResolvedValue({ id: "1", productoId: "p1", stock: 10 });

      const result = await inventoryService.checkDisponibilidad({
        clienteId: "c1", productoId: "p1", cantidad: 5
      });

      expect(result).toBe(true);
    });

    it("retorna false si el producto no existe", async () => {
      mockRepo.getItemByProductId.mockResolvedValue(null);

      const result = await inventoryService.checkDisponibilidad({
        clienteId: "c1", productoId: "p1", cantidad: 5
      });

      expect(result).toBe(false);
    });

    it("retorna false si el stock es insuficiente", async () => {
      mockRepo.getItemByProductId.mockResolvedValue({ id: "1", productoId: "p1", stock: 2 });

      const result = await inventoryService.checkDisponibilidad({
        clienteId: "c1", productoId: "p1", cantidad: 10
      });

      expect(result).toBe(false);
    });
  });

  describe("descontarStock", () => {
    it("lanza NotFoundError si el producto no existe", async () => {
      mockRepo.getItemByProductId.mockResolvedValue(null);

      await expect(
        inventoryService.descontarStock({ clienteId: "c1", productoId: "p1", cantidad: 5 })
      ).rejects.toThrow("Inventory item not found");
    });

    it("lanza BadRequestError si el stock es insuficiente", async () => {
      mockRepo.getItemByProductId.mockResolvedValue({ id: "1", productoId: "p1", stock: 2 });

      await expect(
        inventoryService.descontarStock({ clienteId: "c1", productoId: "p1", cantidad: 10 })
      ).rejects.toThrow("Insufficient stock");
    });

    it("descuenta correctamente el stock", async () => {
      mockRepo.getItemByProductId.mockResolvedValue({ id: "1", productoId: "p1", stock: 10 });
      mockRepo.upsertMovement.mockResolvedValue({ id: "1", productoId: "p1", stock: 5 });

      const result = await inventoryService.descontarStock({
        clienteId: "c1", productoId: "p1", cantidad: 5
      });

      expect(result.stock).toBe(5);
    });
  });
});
