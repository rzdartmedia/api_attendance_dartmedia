class AttendanceHandler {
    constructor({
        service,
        validator,
        storageService
    }) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;

        this.addAttendanceHandler = this.addAttendanceHandler.bind(this);
        this.getAttendanceByIdAndNikHandler = this.getAttendanceByIdAndNikHandler.bind(this);
        this.putAttendanceHandler = this.putAttendanceHandler.bind(this);
        this.getAttendancesByNikHandler = this.getAttendancesByNikHandler.bind(this);
        this.getLatestAttendancesByNik = this.getLatestAttendancesByNik.bind(this);
    }

    // Absen masuk
    async addAttendanceHandler(request) {
        this._validator.validateAddAthendancePayload(request.payload);

        const {
            nik
        } = request.auth.credentials;
        const {
            photo
        } = request.payload;

        this._validator.validateImageHeaders(photo.hapi.headers);

        // check 1 day 1 absen
        await this._service.checkAttendanceNikAndDate(nik);

        const folder = 'images/attendances';

        const namePhoto = await this._storageService.writeFile(
            photo,
            photo.hapi,
            folder
        );
        const urlPhoto = `/${folder}/${namePhoto}`;

        // Absen masuk
        const id = await this._service.addAttendance(nik, urlPhoto);

        return {
            status: 'success',
            message: 'Berhasil absen masuk',
            data: {
                id
            },
        }
    }

    async putAttendanceHandler(request) {
        this._validator.validateAddAthendancePayload(request.payload);

        const {
            id
        } = request.params;
        const {
            nik
        } = request.auth.credentials;
        const {
            photo
        } = request.payload;

        this._validator.validateImageHeaders(photo.hapi.headers);
        await this._service.checkPutAttendance(id, nik);

        const folder = 'images/attendances';

        const namePhoto = await this._storageService.writeFile(
            photo,
            photo.hapi,
            folder
        );
        const urlPhoto = `/${folder}/${namePhoto}`;

        // Absen masuk
        await this._service.putAttendance(id, nik, urlPhoto);

        return {
            status: 'success',
            message: 'Berhasil absen pulang'
        }
    }

    async getAttendanceByIdAndNikHandler(request) {
        const {
            id
        } = request.params;
        const {
            nik
        } = request.auth.credentials;

        const attendance = await this._service.getAttendanceByIdAndNik(id, nik);

        return {
            status: 'success',
            data: {
                attendance
            }
        }
    }

    async getAttendancesByNikHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        const attendances = await this._service.getAttendancesByNik(nik);

        return {
            status: 'success',
            data: {
                attendances
            }
        }
    }

    async getLatestAttendancesByNik(request) {
        const {
            nik
        } = request.auth.credentials;

        const attendances = await this._service.getAttendancesByNik(nik);

        return {
            status: 'success',
            data: {
                attendances: attendances[0]
            }
        }
    }
}

module.exports = AttendanceHandler;