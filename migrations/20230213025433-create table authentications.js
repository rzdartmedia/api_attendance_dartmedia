module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('authentications',
      {
        id_user: {
          type: Sequelize.STRING(50),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'users',
            key: 'id_user',
          },
          onDelete: 'CASCADE',
        },
        nik: {
          type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('authentications');
  }
};
