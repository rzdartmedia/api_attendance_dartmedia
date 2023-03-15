module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users',
      {
        id_user: {
          type: Sequelize.STRING(50),
          allowNull: false,
          primaryKey: true,
        },
        nik: {
          type: Sequelize.STRING(50),
          allowNull: false,
          indexedDB: true,
          unique: true,
          references: {
            model: 'employees',
            key: 'nik',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        password: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('users');
  }
};
