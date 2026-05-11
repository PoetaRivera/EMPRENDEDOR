const { ClientsService } = require("./clients.service");
const { getPagination } = require("../../shared/http/pagination");

const clientsService = new ClientsService();

async function listBuyers(req, res, next) {
  try {
    const buyers = await clientsService.listBuyers({
      clienteId: req.tenant.clienteId,
      pagination: getPagination(req.query)
    });
    res.json(buyers);
  } catch (error) {
    next(error);
  }
}

async function createBuyer(req, res, next) {
  try {
    const buyer = await clientsService.createBuyer({
      clienteId: req.tenant.clienteId,
      buyer: req.body
    });
    res.status(201).json(buyer);
  } catch (error) {
    next(error);
  }
}

module.exports = { listBuyers, createBuyer };
