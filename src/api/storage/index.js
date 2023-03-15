const prefix = require("../../utils/prefix");
const routes = require("./routes");

module.exports = {
  name: "storage",
  version: "1.0.0",
  register: async (server, {
    storage
  }) => {
    server.route(prefix(process.env.PREFIX, routes(storage)));
  },
};