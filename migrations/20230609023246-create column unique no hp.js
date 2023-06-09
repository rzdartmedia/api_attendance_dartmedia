module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('employees', 'no_hp', {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    });

    await queryInterface.addIndex('employees', ['no_hp']);
    await queryInterface.addIndex('employees', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('employees', ['name']);
    await queryInterface.removeIndex('employees', ['no_hp']);

    await queryInterface.changeColumn('employees', 'no_hp', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });
  }
};