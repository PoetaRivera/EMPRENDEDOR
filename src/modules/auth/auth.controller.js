const { AuthService } = require("./auth.service");

const authService = new AuthService();

async function login(req, res, next) {
  try {
    const auth = await authService.login({
      clienteId: req.tenant.clienteId,
      email: req.body.email
    });
    res.json(auth);
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
