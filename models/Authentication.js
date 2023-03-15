module.exports = (sequelize, DataTypes) => {
    const Authentication = sequelize.define('Authentication', {
        id_user: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id_user',
            },
            onDelete: 'CASCADE',
        },
        nik: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'employees',
                key: 'nik',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'authentications'
    });

    return Authentication;
};