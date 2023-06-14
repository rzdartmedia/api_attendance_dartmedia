const db = require("../../../models");
const ClientError = require("../../exceptions/ClientError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
    MapAttendanceByIdAndNik, MapGetAttandances, MapAttendanceById, MapAttendanceByMonth, MapAttendanceByMonthForTable, MapAttendanceByMonth2, MapAttendanceDayByMonth
} = require("../../utils/MapResult");
const { Attendance } = require('../../../models');
const InvariantError = require("../../exceptions/InvariantError");
const LateComparasion = require("../../utils/LateComparasion");
const WhereGetAttendance = require("../../utils/WhereGetAttendance");
const { where } = require("sequelize");

class AttendanceService {
    constructor() {
        this._pool = db.sequelize;
    }

    // Absen masuk
    async addAttendance(nik, photoAttendance) {
        const date = new Date();
        const status = false;
        const statusAttendanceIn = LateComparasion();

        const { dataValues } = await Attendance.create({
            nik,
            date,
            attendance_in: date,
            photo_attendance_in: photoAttendance,
            status_attendance_in: statusAttendanceIn,
            status
        });

        return dataValues.id_attendance;
    }

    // Check hanya bisa absen pulang lebih dari 5 menit absen masuk
    async checkPutAttendance(idAttendance, nik) {
        const attendance = await this.getAttendanceByIdAndNik(idAttendance, nik);
        if (attendance.status == true) throw new InvariantError('Tidak bisa melakukan absen pulang lebih dari 1x');

        const attendanceIn = new Date(attendance.attendanceIn);
        const date = new Date();
        const selisih = date - attendanceIn;
        const selisihMenit = Math.floor(selisih / 1000 / 60);
        if (selisihMenit < 5) throw new InvariantError('Tidak bisa melakukan absen pulang sebelum lebih dari 5 menit absen masuk');
    }

    // Absen out
    async putAttendance(idAttendance, nik, photoAttendance) {
        const date = new Date();
        const status = true;

        await Attendance.update({
            status,
            attendance_out: date,
            photo_attendance_out: photoAttendance,
        }, {
            where:
            {
                nik: nik,
                id_attendance: idAttendance
            },
        });
    }

    async getAttendanceByIdAndNik(id, nik) {
        const [attendance] = await this._pool.query(`
            SELECT * FROM attendances WHERE id_attendance = :id AND nik = :nik
        `, {
            replacements: {
                id,
                nik
            }
        });

        if (attendance.length < 1) throw new NotFoundError('Attendance tidak ditemukan')

        const result = attendance.map(MapAttendanceByIdAndNik);
        return result[0];
    }

    async checkAttendanceNikAndDate(nik) {
        const date = new Date().toISOString().substr(0, 10);

        // Check apakah absen di hari cuti
        const [permit] = await this._pool.query(`SELECT * FROM permissions
            WHERE '${date}' BETWEEN start_permit_date AND end_permit_date
            AND status_approval = :status
            AND nik = :nik`,
            {
                replacements: {
                    nik,
                    status: 'Approved',
                }
            });

        if (permit.length > 0) throw new InvariantError('Anda sedang cuti ngapain absen ? ')

        // Check absen hanya bisa 1x 1 hari
        const [attendance] = await this._pool.query(`
            SELECT id_attendance FROM attendances
            WHERE nik = :nik AND date = :date
        `, {
            replacements: {
                nik,
                date
            }
        });

        if (attendance.length > 0) throw new ClientError('Gagal absen karena hanya 1 hari 1x absen');
    }

    async getCountAttendancesByNik(nik) {
        const [attendances] = await this._pool.query(`
            SELECT count(*) AS count
            FROM attendances WHERE nik = :nik
        `, {
            replacements: {
                nik
            }
        });

        if (attendances.length < 1) return 0;
        return attendances[0].count;
    }

    async getAttendancesByNik({ limit, offset, nik }) {
        const [attendances] = await this._pool.query(`
            SELECT id_attendance AS idAttendance, date, attendance_in AS attendanceIn,
            attendance_out AS attendanceOut, status,
            status_attendance_in AS statusAttendanceIn
            FROM attendances WHERE nik = :nik ORDER BY date DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: {
                nik,
                limit,
                offset
            }
        });

        return attendances;
    }

    async getCountAttandances({ name, statusAttendanceIn, startDateFilter, endDateFilter }) {
        const where = WhereGetAttendance({ name, statusAttendanceIn, startDateFilter, endDateFilter });
        const [data] = await this._pool.query(`
            SELECT count(*) AS count FROM attendances
            JOIN employees ON
            employees.nik = attendances.nik
            ${where}
        `, {
            replacements: {
                statusAttendanceIn, startDateFilter, endDateFilter
            }
        });

        if (data.length < 1) return 0;
        return data[0].count;
    }

    async getAttandances(limit, offset, { name, statusAttendanceIn, startDateFilter, endDateFilter }) {
        const where = WhereGetAttendance({ name, statusAttendanceIn, startDateFilter, endDateFilter });

        const [data] = await this._pool.query(`
            SELECT id_attendance, name,
            date, attendance_in, 
            status_attendance_in, attendance_out
            FROM attendances
            JOIN employees ON
            employees.nik = attendances.nik
            ${where}
            ORDER BY attendances.createdAt DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: {
                limit,
                offset,
                statusAttendanceIn, startDateFilter, endDateFilter
            }
        });

        const result = data.map(MapGetAttandances)
        return result;
    }

    async getAttendanceById(id) {
        const data = await Attendance.findAll({
            where: {
                id_attendance: id
            },
            attributes: { exclude: ['createdAt'] },
        });

        if (data.length < 1) throw new NotFoundError('Data user is not found')
        const result = data.map(MapAttendanceById);
        return result[0];
    }

    async getDataAttendanceByMonth(startMonth, endMonth, statusAttendanceIn, search) {
        const queryStartMonth = startMonth ? ":startMonth" : "MONTH(CURDATE())";
        const queryEndMonth = endMonth ? ":endMonth" : "MONTH(CURDATE())";
        const whereStatus = statusAttendanceIn ? "AND status_attendance_in = :statusAttendanceIn" : "";
        search = search ? `%${search}%` : '%%';

        const [data] = await this._pool.query(`
            SELECT
            DATE_FORMAT(date, '%M') AS bulan,
            DATE_FORMAT(date, '%Y') AS tahun,
            name,
            COUNT(*) AS jumlah_data
            FROM
            attendances
            JOIN employees ON employees.nik = attendances.nik
            WHERE
            MONTH(date) BETWEEN ${queryStartMonth} AND ${queryEndMonth} 
            AND YEAR(date) = YEAR(CURDATE())
            AND employees.name LIKE :search
            ${whereStatus}
            GROUP BY
            bulan, tahun, name
        `, {
            replacements: {
                startMonth,
                endMonth,
                statusAttendanceIn,
                search,
            }
        });

        const result = MapAttendanceByMonth(data)
        const result2 = MapAttendanceByMonth2(result, startMonth, endMonth)
        return result2;
    }

    async getCountDataAttendanceByMonthForTable(startMonth, endMonth, statusAttendanceIn, search) {
        const queryStartMonth = startMonth ? ":startMonth" : "MONTH(CURDATE())";
        const queryEndMonth = endMonth ? ":endMonth" : "MONTH(CURDATE())";
        const whereStatus = statusAttendanceIn ? "AND status_attendance_in = :statusAttendanceIn" : "";
        search = search ? `%${search}%` : '%%';

        const [data] = await this._pool.query(`
            SELECT count(*) AS total_data FROM
            (SELECT
            DATE_FORMAT(date, '%M') AS bulan,
            DATE_FORMAT(date, '%Y') AS tahun,
            name,
            attendances.status_attendance_in,
            COUNT(*) AS jumlah_data
            FROM
            attendances
            JOIN employees ON employees.nik = attendances.nik
            WHERE
            MONTH(date) BETWEEN ${queryStartMonth} AND ${queryEndMonth} 
            AND YEAR(date) = YEAR(CURDATE())
            AND employees.name LIKE :search
            ${whereStatus}
            GROUP BY
            bulan, tahun, name, status_attendance_in) AS attendances
        `, {
            replacements: {
                startMonth,
                endMonth,
                statusAttendanceIn,
                search,
            }
        });

        return data[0].total_data;
    }

    async getDataAttendanceByMonthForTable(startMonth, endMonth, statusAttendanceIn, search, { limit, offset }) {
        const queryStartMonth = startMonth ? ":startMonth" : "MONTH(CURDATE())";
        const queryEndMonth = endMonth ? ":endMonth" : "MONTH(CURDATE())";
        const whereStatus = statusAttendanceIn ? "AND status_attendance_in = :statusAttendanceIn" : "";
        search = search ? `%${search}%` : '%%';

        const [data] = await this._pool.query(`
            SELECT
            DATE_FORMAT(date, '%M') AS bulan,
            DATE_FORMAT(date, '%Y') AS tahun,
            name,
            attendances.status_attendance_in,
            COUNT(*) AS jumlah_data
            FROM
            attendances
            JOIN employees ON employees.nik = attendances.nik
            WHERE
            MONTH(date) BETWEEN ${queryStartMonth} AND ${queryEndMonth} 
            AND YEAR(date) = YEAR(CURDATE())
            AND employees.name LIKE :search
            ${whereStatus}
            GROUP BY
            bulan, tahun, name, status_attendance_in
            ORDER BY name ASC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: {
                startMonth,
                endMonth,
                statusAttendanceIn,
                search,
                limit,
                offset,
            }
        });

        const result = data.map(MapAttendanceByMonthForTable);
        return result;
    }

    async getReportAttendanceByMonth(month, year) {
        const dataMonth = month || new Date().getMonth() + 1;
        const dataYear = year || new Date().getFullYear();

        const [data] = await this._pool.query(
            `SELECT name, date FROM attendances
            JOIN employees ON employees.nik = attendances.nik
            WHERE MONTH(date) = :dataMonth AND YEAR(date) = :dataYear
            ORDER BY name
            `, {
            replacements: {
                dataMonth,
                dataYear
            }
        }
        );

        const result = MapAttendanceDayByMonth(data, dataMonth, dataYear)
        return result;
    }
}

module.exports = AttendanceService;