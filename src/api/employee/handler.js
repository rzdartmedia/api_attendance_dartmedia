class EmployeeHandler {
    constructor({
        service,
        userService,
        storageService,
        validator,
    }) {
        this._service = service;
        this._userService = userService;
        this._storageService = storageService;
        this._validator = validator;

        this.addEmployeeHandler = this.addEmployeeHandler.bind(this);
        this.getEmployeeByNikHandler = this.getEmployeeByNikHandler.bind(this);
    }

    async addEmployeeHandler(request) {
        // Validation input
        await this._validator.validateAddEmployeePayload(request.payload);

        let havePhotoNpwp = false;

        const {
            photoNpwp,
            photoKtp,
            photoSwa,
            nik,
            noHp,
            emailPersonal,
            emailEmployee,
        } = request.payload;

        await this._service.checkUniqueEmployee({
            nik,
            noHp,
            emailPersonal,
            emailEmployee
        });

        if (photoNpwp) {
            if (photoNpwp.hapi.filename) {
                havePhotoNpwp = true;
                this._validator.validateImageHeaders(photoNpwp.hapi.headers);
            }
        } else {
            request.payload.photoNpwp = null;
        }

        this._validator.validateImageHeaders(photoSwa.hapi.headers);
        this._validator.validateImageHeaders(photoKtp.hapi.headers);

        const namePhotoKtp = await this._storageService.writeFile(
            photoKtp,
            photoKtp.hapi,
            'images/ktp'
        );
        request.payload.photoKtp = `/images/ktp/${namePhotoKtp}`;

        const namePhotoSwa = await this._storageService.writeFile(
            photoSwa,
            photoSwa.hapi,
            'images/swa'
        );
        request.payload.photoSwa = `/images/swa/${namePhotoSwa}`;

        if (havePhotoNpwp) {
            const namePhotoNpwp = await this._storageService.writeFile(
                photoNpwp,
                photoNpwp.hapi,
                'images/npwp'
            );
            request.payload.photoNpwp = `/images/npwp/${namePhotoNpwp}`;
        }

        const {
            employeeId,
            employeeNik
        } = await this._service.addEmployee(request.payload);
        await this._userService.addUser(employeeNik);

        return {
            status: 'success',
            message: 'Berhasil menambahkan karyawan',
            data: {
                id: employeeId,
                nik: employeeNik
            }
        }
    }

    async getEmployeeByNikHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        const employee = await this._service.getEmployeeByNik(nik);

        return {
            status: 'success',
            data: {
                employee
            }
        }
    }
}

module.exports = EmployeeHandler;