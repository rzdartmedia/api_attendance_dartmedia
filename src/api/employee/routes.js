const routes = (handler) => [{
        method: 'POST',
        path: '/employee',
        handler: handler.addEmployeeHandler,
        options: {
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 2000000, //2mb
                timeout: false,
            },
        }
    },
    {
        method: 'GET',
        path: '/employee/user',
        handler: handler.getEmployeeByNikHandler,
        options: {
            auth: "employee_jwt",
        },
    },
];

module.exports = routes;