const { AuthService } = require("../modules/auth/auth.service");

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it("genera un token JWT valido al hacer login", () => {
    const result = authService.login({ clienteId: "c1", email: "test@test.com" });

    expect(result.accessToken).toBeTruthy();
    expect(typeof result.accessToken).toBe("string");
    expect(result.accessToken.split(".").length).toBe(3);
    expect(result.user.email).toBe("test@test.com");
    expect(result.user.clienteId).toBe("c1");
  });

  it("verifyToken devuelve el payload para un token valido", () => {
    const { accessToken } = authService.login({ clienteId: "c1", email: "x@x.com" });
    const payload = authService.verifyToken(accessToken);

    expect(payload.clienteId).toBe("c1");
    expect(payload.email).toBe("x@x.com");
    expect(payload.role).toBe("admin");
  });

  it("verifyToken lanza error con un token invalido", () => {
    expect(() => authService.verifyToken("token-falso")).toThrow();
  });
});
