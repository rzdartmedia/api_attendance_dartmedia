module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permission_categories',
      {
        id_category_permission: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
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
    await queryInterface.dropTable('permission_categories');
  }
};
