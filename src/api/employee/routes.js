const routes = (handler) => [
    {
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
        handler: handler.getEmployeeByTokenHandler,
        options: {
            auth: "employee_jwt",
        },
    },
    {
        method: 'GET',
        path: '/employee',
        handler: handler.getEmployeeForCmsHandler,
        options: {
            auth: "employee_jwt",
        },
    },
    {
        method: 'GET',
        path: '/employee/{nik}',
        handler: handler.getEmployeeByIdForCmsHandler,
        options: {
            auth: "employee_jwt",
        },
    },
    {
        method: 'PUT',
        path: '/employee/{nik}',
        handler: handler.updateStatusEmployeeByNikHandler,
        options: {
            auth: "employee_jwt",
        },
    },
];

module.exports = routes;