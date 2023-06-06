class AttendanceHandler {
    constructor({
        service,
        validator,
        storageService,
        userService
    }) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;
        this._userService = userService;

        this.addAttendanceHandler = this.addAttendanceHandler.bind(this);
        this.getAttendanceByIdAndNikHandler = this.getAttendanceByIdAndNikHandler.bind(this);
        this.putAttendanceHandler = this.putAttendanceHandler.bind(this);
        this.getAttendancesByNikHandler = this.getAttendancesByNikHandler.bind(this);
        this.getLatestAttendancesByNikHandler = this.getLatestAttendancesByNikHandler.bind(this);
        this.getAttendancesHander = this.getAttendancesHander.bind(this);
        this.getAttendanceByIdHandler = this.getAttendanceByIdHandler.bind(this);
        this.getAttendanceByMonthHandler = this.getAttendanceByMonthHandler.bind(this);
        this.getAttendanceByMontForTablehHandler = this.getAttendanceByMontForTablehHandler.bind(this);
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

        const numRows = await this._service.getCountAttendancesByNik(nik);
        const limit = parseInt(request.query.limit) || 10;
        const page = parseInt(request.query.page) || 1;
        const totalPages = Math.ceil(numRows / limit);
        const offset = limit * (page - 1);
        const attendances = await this._service.getAttendancesByNik({ limit, offset, nik });

        return {
            status: 'success',
            data: {
                attendances
            },
            totalData: numRows,
            totalPages: totalPages
        }
    }

    async getLatestAttendancesByNikHandler(request) {
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

    async getAttendancesHander(request) {
        const {
            nik
        } = request.auth.credentials;

        await this._userService.checkRoleAdmin(nik);
        this._validator.validateGetAttendanceQuery(request.query);

        const numRows = await this._service.getCountAttandances(request.query);
        const limit = parseInt(request.query.limit) || 10;
        const page = parseInt(request.query.page) || 1;
        const totalPages = Math.ceil(numRows / limit);
        const offset = limit * (page - 1);
        const attendances = await this._service.getAttandances(limit, offset, request.query);

        return {
            status: 'success',
            data: {
                attendances
            },
            totalData: numRows,
            totalPages: totalPages
        }
    }

    async getAttendanceByIdHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        await this._userService.checkRoleAdmin(nik);
        const attendance = await this._service.getAttendanceById(request.params.id);
        return {
            status: 'success',
            data: {
                attendance
            }
        }
    }

    async getAttendanceByMonthHandler(request) {
        const {
            nik
        } = request.auth.credentials;
        const { startMonth, endMonth, statusAttendanceIn, search } = request.query;

        await this._userService.checkRoleAdmin(nik);

        const attendances = await this._service.getDataAttendanceByMonth(startMonth, endMonth, statusAttendanceIn, search);
        return {
            status: 'success',
            data: { attendances }
        }
    }

    async getAttendanceByMontForTablehHandler(request) {
        const {
            nik
        } = request.auth.credentials;
        const { startMonth, endMonth, statusAttendanceIn, search } = request.query;

        await this._userService.checkRoleAdmin(nik);

        const numRows = await this._service.getCountDataAttendanceByMonthForTable(startMonth, endMonth, statusAttendanceIn, search);
        const limit = parseInt(request.query.limit) || 10;
        const page = parseInt(request.query.page) || 1;
        const totalPages = Math.ceil(numRows / limit);
        const offset = limit * (page - 1);
        const attendances = await this._service.getDataAttendanceByMonthForTable(startMonth, endMonth, statusAttendanceIn, search, { limit, offset });

        return {
            status: 'success',
            data: {
                attendances
            },
            totalData: numRows,
            totalPages: totalPages
        }
    }
}

module.exports = AttendanceHandler;