const { AuthService } = require("../modules/auth/auth.service");

const authService = new AuthService();

const PUBLIC_PATHS = ["/health", "/api/auth/login"];

function authMiddleware(req, res, next) {
  if (PUBLIC_PATHS.includes(req.path)) {
    return next();
  }

  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authMiddleware };
