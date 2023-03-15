module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
        id_attendance: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nik: {
            type: DataTypes.STRING(50),
            allowNull: false,
            indexedDB: true,
            unique: false,
            references: {
                model: 'employees',
                key: 'nik',
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        attendance_in: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        photo_attendance_in: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status_attendance_in: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        attendance_out: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        photo_attendance_out: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
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
        tableName: 'attendances'
    });

    return Attendance;
};