module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances',
      {
        id_attendance: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        nik: {
          type: Sequelize.STRING(50),
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
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        attendance_in: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        photo_attendance_in: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status_attendance_in: {
          type: Sequelize.STRING(),
          allowNull: false,
        },
        attendance_out: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        photo_attendance_out: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendances');
  }
};
