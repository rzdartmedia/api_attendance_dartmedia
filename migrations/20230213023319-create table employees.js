module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees',
      {
        id_employee: {
          type: Sequelize.STRING(50),
          allowNull: false,
          primaryKey: true,
        },
        nik: {
          type: Sequelize.STRING(50),
          allowNull: false,
          indexedDB: true,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        position: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        division: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        gender: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        npwp: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        place_of_birth: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        date_of_birth: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        address_ktp: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        no_hp: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        religion: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        email_personal: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        email_employee: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        ptkp: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        blood: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        photo_ktp: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        photo_npwp: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        photo_swa: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        name_family: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        connection_family: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        no_hp_family: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        address_family: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status_employee: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        work_location: {
          type: Sequelize.TEXT,
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
    await queryInterface.dropTable('employees');
  }
};
