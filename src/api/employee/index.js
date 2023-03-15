const prefix = require("../../utils/prefix");
const EmployeeHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'employee',
    register: async (server, {
        service,
        userService,
        storageService,
        validator,
    }) => {
        const employeeHandler = new EmployeeHandler({
            service,
            userService,
            storageService,
            validator,
        });

        server.route(prefix(process.env.PREFIX, routes(employeeHandler)))
    }
}