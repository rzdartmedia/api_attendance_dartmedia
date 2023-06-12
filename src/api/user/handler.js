class UserHandler {
    constructor({
        service,
        validator
    }) {
        this._service = service;
        this._validator = validator;

        this.updatePasswordUserByToken = this.updatePasswordUserByToken.bind(this);
    }

    async updatePasswordUserByToken(request) {
        this._validator.validateUpdatePasswordPayload(request.payload);
        const {
            nik
        } = request.auth.credentials;

        await this._service.changePasswordByNik(nik, request.payload);

        return {
            status: 'success',
            message: 'Berhasil mengganti password'
        }
    }
}

module.exports = UserHandler;