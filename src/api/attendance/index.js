const prefix = require("../../utils/prefix");
const routes = require("./routes");
const AttendanceHandler = require("./handler")

module.exports = {
    name: 'attendance',
    register: async (server, {
        service,
        validator,
        storageService
    }) => {
        const attandanceHandler = new AttendanceHandler({
            service,
            validator,
            storageService
        });

        server.route(prefix(process.env.PREFIX, routes(attandanceHandler)));
    },
};