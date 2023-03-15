module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions',
      {
        id_permission: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        nik: {
          type: Sequelize.STRING(50),
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
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        start_permit_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        end_permit_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        length_permit_day: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        attachment: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        information_permission: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status_approval: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        information_approval: {
          type: Sequelize.TEXT,
          allowNull: true,
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
    await queryInterface.dropTable('permissions');
  }
};
