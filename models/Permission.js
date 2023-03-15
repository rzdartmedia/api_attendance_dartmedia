module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        id_permission: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nik: {
            type: DataTypes.STRING(50),
            allowNull: false,
            indexedDB: true,
            references: {
                model: 'employees',
                key: 'nik',
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },
        category_permission: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        start_permit_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_permit_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        length_permit_day: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        attachment: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        information_permission: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status_approval: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        information_approval: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'permissions'
    });

    return Permission;
};