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
        path: '/employee/status/{nik}',
        handler: handler.updateStatusEmployeeByNikHandler,
        options: {
            auth: "employee_jwt",
        },
    },
    {
        method: 'PUT',
        path: '/employee/user',
        handler: handler.updateEmployeeByTokenHandler,
        options: {
            auth: "employee_jwt",
        },
    },
    {
        method: 'PUT',
        path: '/employee/user/npwp',
        handler: handler.updateNPWPEmployeeByTokenHandler,
        options: {
            auth: "employee_jwt",
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 1245000, //1mb
                timeout: false,
            },
        },
    },
];

module.exports = routes;