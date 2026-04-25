const { ClientsRepository } = require("./clients.repository");

class ClientsService {
  constructor({ clientsRepository = new ClientsRepository() } = {}) {
    this.clientsRepository = clientsRepository;
  }

  listBuyers({ clienteId }) {
    return this.clientsRepository.listBuyers(clienteId);
  }

  createBuyer({ clienteId, buyer }) {
    return this.clientsRepository.createBuyer(clienteId, {
      ...buyer,
      createdAt: new Date().toISOString()
    });
  }
}

module.exports = { ClientsService };
