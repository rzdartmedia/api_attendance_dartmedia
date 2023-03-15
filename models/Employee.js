module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
        id_employee: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        nik: {
            type: DataTypes.STRING(50),
            allowNull: false,
            indexedDB: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        position: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        division: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        npwp: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        place_of_birth: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        address_ktp: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        no_hp: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        religion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email_personal: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        email_employee: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        ptkp: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        blood: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        photo_ktp: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        photo_npwp: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        photo_swa: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        name_family: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        connection_family: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        no_hp_family: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        address_family: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status_employee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        work_location: {
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
        tableName: 'employees'
    });

    return Employee;
}