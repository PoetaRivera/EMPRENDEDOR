const moduleCollections = {
  catalog: "productos",
  inventory: "inventario",
  orders: "pedidos",
  clients: "clientesData",
  payments: "pagos",
  auth: "usuarios"
};

function tenantItemsCollection(db, moduleKey, clienteId) {
  return db.collection(moduleCollections[moduleKey]).doc(clienteId).collection("items");
}

module.exports = { tenantItemsCollection };
