const {
    nanoid
} = require("nanoid");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const db = require("../../../models");
const { User } = require('../../../models');
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

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
        noHp,
        password
    }) {
        const [user] = await this._pool.query(`
            SELECT id_user, employees.nik AS nik_employee, password AS hashed_password, status FROM users
            JOIN employees ON employees.nik = users.nik
            WHERE no_hp = :noHp LIMIT 1 
        `, {
            replacements: {
                noHp
            }
        });

        if (user.length < 1) throw new InvariantError('No Handphone tidak terdaftar');

        const {
            id_user,
            nik_employee,
            hashed_password,
            status,
        } = user[0];

        if (!status) throw new InvariantError('Anda sudah tidak aktif');

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

    async checkRoleAdmin(nik) {
        const [data] = await this._pool.query('SELECT role FROM users WHERE nik = :nik',
            {
                replacements: {
                    nik
                }
            });

        if (data.length < 1) throw new NotFoundError('User is not found');
        if (data[0].role !== 'admin') throw new AuthorizationError('Are you not entitied')
    }

    async checkPassword(nik, password) {
        const [data] = await this._pool.query(`SELECT password FROM users WHERE nik = :nik`, {
            replacements: {
                nik,
            }
        });

        if (data.length < 1) throw new NotFoundError('Akun tidak ada');

        const { password: hashdedPassword } = data[0];
        console.log(hashdedPassword);
        console.log(password);
        const match = await bcrypt.compare(password, hashdedPassword);

        if (!match) throw new AuthenticationError("Password yang anda berikan salah");
    }

    async changePasswordByNik(nik, { passwordNew, passwordOld }) {
        await this.checkPassword(nik, passwordOld);

        passwordNew = await bcrypt.hash(passwordNew, 10);

        await this._pool.query(`UPDATE users SET password = :passwordNew WHERE nik = :nik`,
            {
                replacements: {
                    nik, passwordNew
                }
            });

        await this.deleteAuthenticationForUpdatePassword(nik);
    }

    async deleteAuthenticationForUpdatePassword(nik) {
        await this._pool.query(`DELETE FROM authentications WHERE nik = :nik`,
            {
                replacements: {
                    nik
                }
            })
    }
}

module.exports = UserService;