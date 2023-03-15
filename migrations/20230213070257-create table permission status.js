module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permission_status', [
      {
        id_permission_status: '1',
        name: 'Waiting Approvel'
      },
      {
        id_permission_status: '2',
        name: 'Approved'
      },
      {
        id_permission_status: '3',
        name: 'Rejected'
      },
      {
        id_permission_status: '4',
        name: 'Revised'
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('permission_status', { id_permission_status: { [Op.in]: [1, 2, 3, 4] } });
  }
};
