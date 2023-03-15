const {
    nanoid
} = require("nanoid");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const db = require("../../../models");
const { User } = require('../../../models');

class UserService {
    constructor() {
        this._pool = db.sequelize;
    }

    async addUser(employeeNik) {
        const id = `user-${nanoid(10)}`;
        const password = await bcrypt.hash('dartmedia', 10);
        const status = true;
        const role = 'user';

        await User.create({
            id_user: id,
            nik: employeeNik,
            password,
            status,
            role,
        });
    }

    async verifyUserCredential({
        nik,
        password
    }) {
        const [user] = await this._pool.query(`
            SELECT id_user, nik AS nik_employee, password AS hashed_password FROM users
            WHERE nik = :nik LIMIT 1 
        `, {
            replacements: {
                nik
            }
        });

        if (user.length < 1) throw new InvariantError('NIK tidak terdaftar');

        const {
            id_user,
            nik_employee,
            hashed_password
        } = user[0];

        const match = await bcrypt.compare(password, hashed_password);

        if (!match) throw new AuthenticationError("Password yang anda berikan salah");

        const data = {
            userId: id_user,
            employeeNik: nik_employee
        };

        return data;
    }

    async getRole(nik) {
        const [data] = await this._pool.query('SELECT role FROM users WHERE nik = :nik',
            {
                replacements: {
                    nik
                }
            });

        return data[0].role;
    }
}

module.exports = UserService;