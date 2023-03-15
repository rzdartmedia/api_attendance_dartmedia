const db = require("../../../models");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const { Authentication } = require('../../../models');

class AuthenticationService {
    constructor() {
        this._pool = db.sequelize;
    }

    async addAuthentication({
        token,
        nik,
        userId,
    }) {
        const query = await this.checkAuthentication(userId);
        const date = new Date();

        if (query === 'update') {
            await Authentication.update({
                token,
                nik,
                updatedAt: date,
            }, { where: { id_user: userId } });
        } else if (query === 'insert') {
            await Authentication.create({
                id_user: userId,
                nik,
                token,
            })
        };
    }

    async checkAuthentication(userId) {
        const [token] = await this._pool.query(`
            SELECT id_user FROM authentications
            WHERE id_user = :userId
        `, {
            replacements: {
                userId
            }
        });

        if (token.length > 0) {
            return 'update';
        } else {
            return 'insert';
        }
    };

    async deleteAuthentication(token) {
        await this.checkRefreshToken(token);

        await this._pool.query(
            `DELETE FROM authentications WHERE token = :token`, {
            replacements: {
                token
            }
        }
        );
    };

    async checkRefreshToken(token) {
        const [refreshToken] = await this._pool.query(`
            SELECT id_user, nik, token FROM authentications WHERE token = :token
        `, {
            replacements: {
                token
            }
        });

        if (refreshToken.length < 1) throw new AuthenticationError('Token is invalid');

        return {
            userId: refreshToken[0].id_user,
            nik: refreshToken[0].nik
        }
    }
};

module.exports = AuthenticationService;