const db = require("../../../models");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const GenerateIdEmployee = require("../../utils/GenerateIdEmployee");
const {
    MapEmployeeByNik
} = require("../../utils/MapResult");
const { Employee } = require('../../../models');

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
}

module.exports = EmployeeService