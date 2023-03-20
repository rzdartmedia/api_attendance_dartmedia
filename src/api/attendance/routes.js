const routes = (handler) => [
    {
        method: 'POST',
        path: '/attendance',
        handler: handler.addAttendanceHandler,
        options: {
            auth: 'employee_jwt',
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 500000, //500kb
                timeout: false,
            },
        },
    },
    {
        method: 'GET',
        path: '/attendance/{id}',
        handler: handler.getAttendanceByIdAndNikHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/attendance/{id}',
        handler: handler.putAttendanceHandler,
        options: {
            auth: 'employee_jwt',
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                output: "stream",
                maxBytes: 500000, //500kb
                timeout: false,
            },
        },
    },
    {
        method: 'GET',
        path: '/attendance/user',
        handler: handler.getAttendancesByNikHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'GET',
        path: '/attendance/user/latest',
        handler: handler.getLatestAttendancesByNikHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'GET',
        path: '/attendance',
        handler: handler.getAttendancesHander,
        options: {
            auth: 'employee_jwt',
        },
    },
    {
        method: 'GET',
        path: '/attendance/cms/{id}',
        handler: handler.getAttendanceByIdHandler,
        options: {
            auth: 'employee_jwt',
        },
    },
];

module.exports = routes;