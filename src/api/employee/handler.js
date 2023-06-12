const InvariantError = require("../../exceptions/InvariantError");

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
        this.getEmployeeByTokenHandler = this.getEmployeeByTokenHandler.bind(this);

        this.getEmployeeForCmsHandler = this.getEmployeeForCmsHandler.bind(this);
        this.getEmployeeByIdForCmsHandler = this.getEmployeeByIdForCmsHandler.bind(this);
        this.updateStatusEmployeeByNikHandler = this.updateStatusEmployeeByNikHandler.bind(this);
        this.updateEmployeeByTokenHandler = this.updateEmployeeByTokenHandler.bind(this);
        this.updateNPWPEmployeeByTokenHandler = this.updateNPWPEmployeeByTokenHandler.bind(this);
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

    async getEmployeeByTokenHandler(request) {
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

    async getEmployeeForCmsHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        await this._userService.checkRoleAdmin(nik);

        const name = request.query.name || "";
        const numRows = await this._service.getCountEmployee(name);
        const limit = parseInt(request.query.limit) || 10;
        const page = parseInt(request.query.page) || 1;
        const totalPages = Math.ceil(numRows / limit);
        const offset = limit * (page - 1);
        const employees = await this._service.getEmployeesForCms({ limit, offset, name });

        return {
            status: 'success',
            data: {
                employees
            },
            totalData: numRows,
            totalPages: totalPages
        }
    }

    async getEmployeeByIdForCmsHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        await this._userService.checkRoleAdmin(nik);

        const employee = await this._service.getEmployeeByNik(request.params.nik);

        return {
            status: 'success',
            data: {
                employee
            }
        }
    }

    async updateStatusEmployeeByNikHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        await this._userService.checkRoleAdmin(nik);

        this._validator.validatePutStatusEmployeeByNikPayload(request.payload);

        if (nik == request.params.nik) throw new InvariantError('Cannot disable your own')

        const { status } = request.payload;
        await this._service.updateStatusEmployeeByNik(request.params.nik, status);

        await this._userService.deleteAuthenticationForUpdatePassword(request.params.nik);

        return {
            status: 'success',
            message: 'Berhasil update status'
        }
    }

    async updateEmployeeByTokenHandler(request) {
        this._validator.validateUpdateEmployeeByNikPayload(request.payload);
        const {
            nik
        } = request.auth.credentials;
        request.payload.nik = nik

        await this._service.updateDataEmployeeByNik(request.payload);

        return {
            status: 'success',
            message: 'Berhasil update data'
        }
    }

    async updateNPWPEmployeeByTokenHandler(request) {
        this._validator.validateUpdateNPWPEmployeePayload(request.payload);

        const {
            nik
        } = request.auth.credentials;
        request.payload.nik = nik

        this._service.checkHaveEmployeeByNik(nik);

        const { photoNpwp } = request.payload;

        const namePhotoNpwp = await this._storageService.writeFile(
            photoNpwp,
            photoNpwp.hapi,
            'images/npwp'
        );
        request.payload.photoNpwp = `/images/npwp/${namePhotoNpwp}`;

        const photoNpwpOld = await this._service.getImageOneForUpdate(nik, 'photo_npwp');
        if (photoNpwpOld) {
            const splitPhotoNpwpOld = photoNpwpOld.split('/');
            this._storageService.deleteFile(splitPhotoNpwpOld[splitPhotoNpwpOld.length - 1], 'images/npwp')
        }

        await this._service.updateNpwpByNik(request.payload);

        return {
            status: 'success',
            message: 'Berhasil update NPWP'
        }
    }
}

module.exports = EmployeeHandler;