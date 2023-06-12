const prefix = require("../../utils/prefix");
const UserHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'user',
    register: async (server, {
        service,
        validator,
    }) => {
        const userHandler = new UserHandler({
            service,
            validator,
        });

        server.route(prefix(process.env.PREFIX, routes(userHandler)))
    }
}