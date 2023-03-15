const prefix = require("../../utils/prefix");
const routes = require("./routes");
const PermissionHandler = require("./handler")

module.exports = {
    name: 'permission',
    register: async (server, {
        service,
        validator,
        storageService,
        userService,
    }) => {
        const permissionHandler = new PermissionHandler({
            service,
            validator,
            storageService,
            userService,
        });

        server.route(prefix(process.env.PREFIX, routes(permissionHandler)));
    },
};