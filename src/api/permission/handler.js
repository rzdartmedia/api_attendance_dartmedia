const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PermissionHandler {
    constructor({ service, storageService, validator, userService }) {
        this._service = service;
        this._storageService = storageService;
        this._validator = validator;
        this._userService = userService;

        this.getContentAddPermissionHandler = this.getContentAddPermissionHandler.bind(this);
        this.addPermissionHandler = this.addPermissionHandler.bind(this);
        this.getPermissionsHandler = this.getPermissionsHandler.bind(this);
        this.getPermissionByIdHandler = this.getPermissionByIdHandler.bind(this);
        this.getStatusAprovalPermissionHandler = this.getStatusAprovalPermissionHandler.bind(this);
        this.updateStatusApprovalPermissionByIdHandler = this.updateStatusApprovalPermissionByIdHandler.bind(this);
        this.updatePermissionRevisedHandler = this.updatePermissionRevisedHandler.bind(this);
    }

    async getContentAddPermissionHandler() {
        const permissionCategories = await this._service.getPermissionCategories();

        return {
            status: 'success',
            data: {
                permissionCategories
            }
        }
    }

    async addPermissionHandler(request) {
        this._validator.validateAddPermissionPayload(request.payload);

        const {
            nik
        } = request.auth.credentials;
        request.payload.nik = nik;

        // upload images
        const { attachment } = request.payload;

        let attachments = [];
        if (attachment) {
            if (!attachment.length) {
                attachments.push(attachment);
            } else {
                // image lebih dari 1 file
                attachments = attachment;
            }

            // Validasi file image
            for (const img of attachments) {
                this._validator.validateImageHeaders(img.hapi.headers);
            }
        }

        const lengthPermitDay = await this._service.checkLengthPermitDay(request.payload);
        request.payload.lengthPermitDay = lengthPermitDay;

        await this._service.checkDatePermitInPermission(request.payload);

        const imagesUrl = [];
        const folder = "images/permissions";
        if (attachment) {
            for (const img of attachments) {
                if (img.hapi.filename) {
                    const filename = await this._storageService.writeFile(
                        img,
                        img.hapi,
                        folder
                    );
                    imagesUrl.push(`/${folder}/${filename}`);
                }
            }
        }

        request.payload.attachment = imagesUrl;
        // upload images end

        await this._service.addPermission(request.payload);

        return {
            status: 'success',
            message: 'Berhasil menambahkan permission'
        }
    }

    async getPermissionsHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        const { statusApproval, search } = request.query;

        let permissions = [];
        const role = await this._userService.getRole(nik);

        if (role === 'admin') {
            permissions = await this._service.getPermissionByAdmin(statusApproval, search);
        } else if (role === 'user') {
            permissions = await this._service.getPermissionByNik(nik, statusApproval);
        }

        return {
            status: 'success',
            data: {
                permissions
            }
        }
    }

    async getPermissionByIdHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        const { id } = request.params;

        let permission = [];
        const role = await this._userService.getRole(nik);

        if (role === 'admin') {
            permission = await this._service.getPermissionByIdByAdmin(id);
        } else if (role === 'user') {
            permission = await this._service.getPermissionByIdAndNik(nik, id);
        }

        return {
            status: 'success',
            data: {
                permission
            }
        }
    }

    async getStatusAprovalPermissionHandler() {
        const permissionStatus = await this._service.getPermissionStatus();

        return {
            status: 'success',
            data: {
                permissionStatus
            }
        }
    }

    async updateStatusApprovalPermissionByIdHandler(request) {
        const {
            nik
        } = request.auth.credentials;

        const role = await this._userService.getRole(nik);
        if (role !== 'admin') throw new InvariantError('Anda tidak berhak akses');

        this._validator.validatePutStatusApprovalPermissionPayload(request.payload);

        await this._service.updateStatusApprovalPermissionById(request.payload);

        return {
            status: 'success',
            message: 'Berhasil update status approval permission'
        }
    }

    async updatePermissionRevisedHandler(request) {
        this._validator.validatePutApprovalRevisedPayload(request.payload);

        const {
            nik
        } = request.auth.credentials;

        const { idPermission, attachment } = request.payload;
        const lengthPermitDay = await this._service.checkLengthPermitDay(request.payload);
        request.payload.lengthPermitDay = lengthPermitDay;

        let attachments = [];
        if (attachment) {
            if (!attachment.length) {
                attachments.push(attachment);
            } else {
                // image lebih dari 1 file
                attachments = attachment;
            }

            // Validasi file image
            for (const img of attachments) {
                this._validator.validateImageHeaders(img.hapi.headers);
            }
        }

        // add permission revised in table permissions revised
        const permission = await this._service.getPermissionByIdAndNikForUpdate(nik, idPermission);
        if (!permission) throw new NotFoundError('Permission tidak ada');
        if (permission.statusApproval !== 'Revised') throw new InvariantError('Status approval bukan revised');

        await this._service.addPermissionRevised(permission);

        // update data permission in table permissions
        const imagesUrl = [];
        const folder = "images/permissions";
        if (attachment) {
            for (const img of attachments) {
                if (img.hapi.filename) {
                    const filename = await this._storageService.writeFile(
                        img,
                        img.hapi,
                        folder
                    );
                    imagesUrl.push(`/${folder}/${filename}`);
                }
            }
        }

        request.payload.attachment = imagesUrl;

        await this._service.updatePermissionRevised(request.payload);

        return {
            status: 'success',
            message: 'Berhasil revisi permission'
        }

    }
}

module.exports = PermissionHandler;