class AuthService {
  async login({ clienteId, email }) {
    return {
      accessToken: `demo-token-for-${clienteId}-${email}`,
      user: {
        email,
        role: "admin"
      }
    };
  }
}

module.exports = { AuthService };
