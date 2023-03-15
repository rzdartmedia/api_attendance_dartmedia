const db = require('../../../models');
const { Permission, PermissionRevised } = require('../../../models');
const InvariantError = require('../../exceptions/InvariantError');
const { MapPermissionById, groupBy, MapPermissionByIdForUpdate } = require('../../utils/MapResult');

class PermissionService {
    constructor() {
        this._pool = db.sequelize;
    }

    async getPermissionCategories() {
        const [data] = await this._pool.query('SELECT * FROM permission_categories');

        const result = groupBy(data, 'name');
        return result;
    }

    async checkLengthPermitDay({ startPermitDate, endPermitDate }) {
        const startDate = new Date(startPermitDate);
        const endDate = new Date(endPermitDate);

        let days = 0;
        let currentDate = startDate;
        while (currentDate <= endDate) {
            // cek apakah hari saat ini bukan hari Sabtu atau Minggu
            // 0 = minggu, and 6 = sabtu
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                days++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (days < 1) throw new InvariantError('End Permit Date tidak boleh lebih kecil');

        return days;
    }

    async checkDatePermitInPermission({ nik, startPermitDate, endPermitDate }) {
        // Check apakah permit di hari saat cuti di approved
        const [permit] = await this._pool.query(`SELECT * FROM permissions
            WHERE (start_permit_date BETWEEN :startPermitDate AND :endPermitDate
            OR end_permit_date BETWEEN :startPermitDate AND :endPermitDate)
            AND status_approval != :status
            AND nik = :nik`,
            {
                replacements: {
                    nik,
                    status: 'Rejected',
                    startPermitDate,
                    endPermitDate
                }
            });

        if (permit.length > 0) throw new InvariantError('Tidak bisa izin ditanggal anda mengajukan/disaat cuti/izin')
    }

    async addPermission({ nik, categoryPermission, startPermitDate, endPermitDate, attachment, informationPermission, lengthPermitDay }) {
        const statusApproval = 'Waiting Confirmation';

        await Permission.create({
            nik,
            category_permission: categoryPermission,
            start_permit_date: startPermitDate,
            end_permit_date: endPermitDate,
            length_permit_day: lengthPermitDay,
            attachment,
            information_permission: informationPermission,
            status_approval: statusApproval
        })
    }

    async getPermissionByNik(nik, statusApproval) {
        let wherePermission = { nik };
        if (statusApproval) wherePermission = { nik, status_approval: statusApproval };
        const data = await Permission.findAll({
            attributes: ['id_permission', 'category_permission', 'start_permit_date', 'end_permit_date', 'status_approval'],
            where: wherePermission,
            order: [
                ['createdAt', 'DESC']
            ],
        });

        return data;
    }

    async getPermissionByIdAndNik(nik, id) {
        const [data] = await this._pool.query(`
            SELECT * FROM permissions WHERE nik = :nik AND id_permission = :id
            UNION
            SELECT id_permission, 
            nik, 
            category_permission,
            start_permit_date,
            end_permit_date,
            length_permit_day,
            attachment,
            information_permission,
            status_approval,
            information_approval,
            createdAt,
            updatedAt  
            FROM permissions_revised WHERE nik = :nik AND id_permission = :id
            ORDER BY createdAt`,
            {
                replacements: {
                    nik,
                    id
                }
            });

        const result = data.map(MapPermissionById)
        return result;
    }

    async getPermissionByIdAndNikForUpdate(nik, id) {
        const data = await Permission.findAll({
            where: { nik, id_permission: id }
        });

        const result = data.map(MapPermissionByIdForUpdate)
        return result[0];
    }

    async getPermissionByAdmin(statusApproval, search) {
        let where = `WHERE employees.name LIKE '%${search}%'`;
        where = statusApproval ? `WHERE status_approval= :statusApproval AND employees.name LIKE '%${search}%' ` : where;

        const [data] = await this._pool.query(`SELECT id_permission, 
            category_permission, 
            start_permit_date, 
            end_permit_date, 
            status_approval, 
            employees.name
            FROM permissions
            JOIN employees ON permissions.nik = employees.nik
            ${where}
            ORDER BY permissions.createdAt DESC
            `,
            {
                replacements: {
                    statusApproval,
                    search
                }
            });

        return data;
    }

    async getPermissionByIdByAdmin(id) {
        const [data] = await this._pool.query(`
            SELECT * FROM permissions WHERE id_permission = :id
            UNION
            SELECT id_permission, 
            nik, 
            category_permission,
            start_permit_date,
            end_permit_date,
            length_permit_day,
            attachment,
            information_permission,
            status_approval,
            information_approval,
            createdAt,
            updatedAt  
            FROM permissions_revised WHERE id_permission = :id
            ORDER BY createdAt`,
            {
                replacements: {
                    id
                }
            });

        const result = data.map(MapPermissionById)
        return result;
    }


    async getPermissionStatus() {
        const [data] = await this._pool.query('SELECT * FROM permission_status');

        const result = groupBy(data, 'name');
        return result;
    }

    async updateStatusApprovalPermissionById({ idPermission, statusApproval, informationApproval }) {
        await Permission.update({
            status_approval: statusApproval,
            information_approval: informationApproval,
            updatedAt: new Date(),
        }, {
            where: { id_permission: idPermission }
        });
    }

    async addPermissionRevised(data) {
        await PermissionRevised.create({
            id_permission: data.idPermission,
            nik: data.nik,
            category_permission: data.categoryPermission,
            start_permit_date: data.startPermitDate,
            end_permit_date: data.endPermitDate,
            length_permit_day: data.lengthPermitDay,
            attachment: data.attachment,
            information_permission: data.informationPermission,
            status_approval: data.statusApproval,
            information_approval: data.informationApproval,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        })
    }

    async updatePermissionRevised(payload) {
        const statusApproval = 'Waiting Confirmation';

        await Permission.update({
            category_permission: payload.categoryPermission,
            start_permit_date: payload.startPermitDate,
            end_permit_date: payload.endPermitDate,
            length_permit_day: payload.lengthPermitDay,
            attachment: payload.attachment,
            information_permission: payload.informationPermission,
            information_approval: null,
            status_approval: statusApproval,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            where: { id_permission: payload.idPermission }
        });
    }
}

module.exports = PermissionService;