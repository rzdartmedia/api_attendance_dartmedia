const routes = (handler) => [{
        method: 'POST',
        path: '/authentication',
        handler: handler.addAuthenticationHandler
    },
    {
        method: 'DELETE',
        path: '/authentication',
        handler: handler.deleteAuthenticationHandler
    },
    {
        method: 'PUT',
        path: '/authentication',
        handler: handler.updateAccessTokenHandler
    },
];

module.exports = routes;