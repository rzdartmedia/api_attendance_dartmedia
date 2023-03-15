const routes = (handler) => [
    {
        method: 'GET',
        path: '/permission/content',
        handler: handler.getContentAddPermissionHandler,
        // options: {
        //     auth: 'employee_jwt',
        // },
    },
    {
        method: 'POST',
        path: '/permission',
        handler: handler.addPermissionHandler,
        options: {
            auth: 'employee_jwt',
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 5000000, //5mb
                timeout: false,
            },
        },
    },
    {
        method: 'GET',
        path: '/permission',
        handler: handler.getPermissionsHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'GET',
        path: '/permission/{id}',
        handler: handler.getPermissionByIdHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'GET',
        path: '/permission/content/status',
        handler: handler.getStatusAprovalPermissionHandler,
        // options: {
        //     auth: 'employee_jwt',
        // },
    },
    {
        method: 'PUT',
        path: '/permission',
        handler: handler.updateStatusApprovalPermissionByIdHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/permission/revised',
        handler: handler.updatePermissionRevisedHandler,
        options: {
            auth: 'employee_jwt',
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 5000000, //5mb
                timeout: false,
            },
        },
    },
];

module.exports = routes;
