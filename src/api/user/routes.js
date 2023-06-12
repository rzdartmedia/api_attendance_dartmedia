const routes = (handler) => [
    {
        method: 'PUT',
        path: '/user/password',
        handler: handler.updatePasswordUserByToken,
        options: {
            auth: 'employee_jwt'
        }
    }
]

module.exports = routes;