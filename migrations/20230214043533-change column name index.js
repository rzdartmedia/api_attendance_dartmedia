module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('employees', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      indexedDB: true,
    })

    await queryInterface.changeColumn('attendances', 'nik', {
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('employees', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      indexedDB: false,
    })
  }
};
