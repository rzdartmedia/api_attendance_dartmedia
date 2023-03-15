class AuthenticaionHandler {
    constructor({
        service,
        userService,
        tokenManager,
        validator
    }) {
        this._service = service;
        this._userService = userService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.addAuthenticationHandler = this.addAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
        this.updateAccessTokenHandler = this.updateAccessTokenHandler.bind(this);
    }

    async addAuthenticationHandler(request) {
        this._validator.validateAddAuthenticationPayload(request.payload);

        const {
            userId,
            employeeNik
        } = await this._userService.verifyUserCredential(request.payload);

        const refreshToken = this._tokenManager.generateRefreshToken({
            id: userId,
        });

        const accessToken = this._tokenManager.generateAccessToken({
            id: userId,
            nik: employeeNik
        });

        await this._service.addAuthentication({
            token: refreshToken,
            nik: employeeNik,
            userId,
        });

        return {
            status: 'success',
            message: 'Authentication success',
            data: {
                refreshToken,
                accessToken
            }
        }
    }

    async deleteAuthenticationHandler(request) {
        this._validator.validatePutAuthenticationPayload(request.payload);

        const {
            refreshToken
        } = request.payload;

        await this._service.deleteAuthentication(refreshToken);

        return {
            status: 'success',
            message: 'Authentication berhasil di hapus'
        }
    }

    async updateAccessTokenHandler(request) {
        this._validator.validatePutAuthenticationPayload(request.payload);

        const {
            refreshToken
        } = request.payload;

        const {
            userId,
            nik
        } = await this._service.checkRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({
            id: userId,
            nik
        });

        return {
            status: 'success',
            data: {
                accessToken
            }
        }
    }
}

module.exports = AuthenticaionHandler;