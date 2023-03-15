const prefix = require("../../utils/prefix");
const routes = require("./routes");
const AuthenticaionHandler = require("./handler")

module.exports = {
    name: 'authentication',
    register: async (server, {
        service,
        userService,
        tokenManager,
        validator
    }) => {
        const authenticationHandler = new AuthenticaionHandler({
            service,
            userService,
            tokenManager,
            validator
        });

        server.route(prefix(process.env.PREFIX, routes(authenticationHandler)));
    },
};