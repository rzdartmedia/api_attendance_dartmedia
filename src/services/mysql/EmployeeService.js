const db = require("../../../models");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const GenerateIdEmployee = require("../../utils/GenerateIdEmployee");
const {
    MapEmployeeByNik
} = require("../../utils/MapResult");
const { Employee } = require('../../../models');
const StringToLikeSearch = require("../../utils/StringToLikeSearch");
const { col } = require("sequelize");

class EmployeeService {
    constructor() {
        this._pool = db.sequelize;
    }

    async addEmployee(data) {
        const id = await GenerateIdEmployee();
        const statusEmployee = true;

        await Employee.create({
            id_employee: id,
            nik: data.nik,
            name: data.name,
            position: data.position,
            division: data.division,
            gender: data.gender,
            npwp: data.npwp ? data.npwp : null,
            place_of_birth: data.placeOfBirth,
            date_of_birth: data.dateOfBirth,
            address_ktp: data.addressKtp,
            address: data.address,
            no_hp: data.noHp,
            religion: data.religion,
            email_personal: data.emailPersonal,
            email_employee: data.emailEmployee,
            ptkp: data.ptkp,
            blood: data.blood,
            photo_ktp: data.photoKtp,
            photo_npwp: data.photoNpwp,
            photo_swa: data.photoSwa,
            name_family: data.nameFamily,
            connection_family: data.connectionFamily,
            no_hp_family: data.noHpFamily,
            address_family: data.addressFamily,
            status_employee: statusEmployee,
            work_location: data.workLocation,
        });

        return {
            employeeId: id,
            employeeNik: data.nik
        };
    }

    async checkUniqueEmployee(data) {
        const errorMessage = [];
        const [checkUniqueNik] = await this._pool.query(
            `SELECT nik FROM employees WHERE nik = :nik LIMIT 1`, {
            replacements: {
                nik: data.nik
            }
        }
        );

        if (checkUniqueNik.length > 0) {
            errorMessage.push('NIK sudah digunakan');
        }

        const [checkUniqueNoHp] = await this._pool.query(
            `SELECT no_hp FROM employees WHERE no_hp = :noHp LIMIT 1`, {
            replacements: {
                noHp: data.noHp
            }
        }
        )

        if (checkUniqueNoHp.length > 0) {
            errorMessage.push('No Hanphone sudah digunakan');
        }

        const [checkUniqueEmailPersonal] = await this._pool.query(
            `SELECT email_personal FROM employees WHERE email_personal = :emailPersonal LIMIT 1`, {
            replacements: {
                emailPersonal: data.emailPersonal
            }
        }
        )

        if (checkUniqueEmailPersonal.length > 0) {
            errorMessage.push('Email personal sudah digunakan');
        }

        const [checkUniqueEmailEmployee] = await this._pool.query(
            `SELECT email_employee FROM employees WHERE email_employee = :emailEmployee LIMIT 1`, {
            replacements: {
                emailEmployee: data.emailEmployee
            }
        }
        )

        if (checkUniqueEmailEmployee.length > 0) {
            errorMessage.push('Email employee sudah digunakan');
        }

        if (errorMessage.length > 0) {
            throw new InvariantError(errorMessage);
        }
    }

    async getEmployeeByNik(nik) {
        const [employee] = await this._pool.query(`
            SELECT employees.*, users.role FROM employees
            JOIN users ON users.nik = employees.nik
            WHERE employees.nik = :nik
        `, {
            replacements: {
                nik
            }
        });

        if (employee.length < 1) throw new NotFoundError('Employee tidak ada')

        const result = employee.map(MapEmployeeByNik);
        return result[0];
    }

    async getCountEmployee(name) {
        name = StringToLikeSearch(name);
        const [result] = await this._pool.query(`
            SELECT count(*) AS count FROM employees
            WHERE name LIKE :name
        `, {
            replacements: {
                name
            }
        });

        if (result.length < 1) return 0;
        return result[0].count;
    }

    async getEmployeesForCms({ offset, limit, name }) {
        name = StringToLikeSearch(name);
        const [result] = await this._pool.query(`
            SELECT status_employee, nik, name, position, division, no_hp, email_employee, email_personal,
            gender, blood, religion FROM employees
            WHERE name LIKE :name
            ORDER BY createdAt DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: {
                offset,
                limit,
                name
            }
        });

        return result;
    }

    async checkHaveEmployeeByNik(nik) {
        const [result] = await this._pool.query(`
            SELECT id_employee FROM employees WHERE nik = nik
        `, {
            replacements: {
                nik,
            }
        });

        if (result.length < 1) throw new NotFoundError(`Employee is not found`);
    }

    async updateStatusEmployeeByNik(nik, status) {
        this.checkHaveEmployeeByNik(nik);

        await this._pool.query(`
            UPDATE users SET status = :status WHERE nik = :nik
        `, {
            replacements: {
                nik, status
            }
        });

        await this._pool.query(`
            UPDATE employees SET status_employee = :status WHERE nik = :nik
        `, {
            replacements: {
                nik, status
            }
        });
    }

    async checkUniqueUpdate(nik, column, data, columnName) {
        const [result] = await this._pool.query(`
            SELECT id_employee FROM employees WHERE ${column} = :data AND nik != :nik
        `, {
            replacements: {
                nik,
                data
            }
        });

        if (result.length > 0) throw new InvariantError(`${columnName} already owned by another employee`);
    }

    async updateDataEmployeeByNik({
        nik,
        name,
        position,
        division,
        gender,
        placeOfBirth,
        dateOfBirth,
        addressKtp,
        address,
        religion,
        emailPersonal,
        emailEmployee,
        ptkp,
        blood,
        nameFamily,
        connectionFamily,
        noHpFamily,
        addressFamily,
        workLocation,
    }) {
        await this.checkHaveEmployeeByNik(nik);
        await this.checkUniqueUpdate(nik, 'email_personal', emailPersonal, 'Email personal');
        await this.checkUniqueUpdate(nik, 'email_employee', emailEmployee, 'Email employee');

        await Employee.update({
            name: name,
            position: position,
            division: division,
            gender: gender,
            place_of_birth: placeOfBirth,
            date_of_birth: dateOfBirth,
            address_ktp: addressKtp,
            address: address,
            religion: religion,
            email_personal: emailPersonal,
            email_employee: emailEmployee,
            ptkp: ptkp,
            blood: blood,
            name_family: nameFamily,
            connection_family: connectionFamily,
            no_hp_family: noHpFamily,
            address_family: addressFamily,
            work_location: workLocation,
        }, {
            where: {
                nik: nik
            }
        });
    }

    async getImageOneForUpdate(nik, column) {
        const [result] = await this._pool.query(`
            SELECT ${column} FROM employees WHERE nik = :nik
        `, {
            replacements: {
                nik: nik
            }
        });

        return result[0][column];
    }

    async updateNpwpByNik({ nik, npwp, photoNpwp }) {
        await this.checkUniqueUpdate(nik, 'npwp', npwp, 'NPWP');

        await Employee.update({
            npwp: npwp,
            photo_npwp: photoNpwp,
        }, {
            where: {
                nik: nik
            }
        });
    }
}

module.exports = EmployeeService