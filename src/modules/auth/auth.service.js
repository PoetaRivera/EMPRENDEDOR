const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");

class AuthService {
  login({ clienteId, email }) {
    const payload = { clienteId, email, role: "admin" };
    const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: "8h" });
    return { accessToken, user: { email, role: "admin", clienteId } };
  }

  verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
  }
}

module.exports = { AuthService };
