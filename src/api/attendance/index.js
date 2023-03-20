const prefix = require("../../utils/prefix");
const routes = require("./routes");
const AttendanceHandler = require("./handler")

module.exports = {
    name: 'attendance',
    register: async (server, {
        service,
        validator,
        storageService,
        userService
    }) => {
        const attandanceHandler = new AttendanceHandler({
            service,
            validator,
            storageService,
            userService
        });

        server.route(prefix(process.env.PREFIX, routes(attandanceHandler)));
    },
};