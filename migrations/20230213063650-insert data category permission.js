module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permission_categories', [
      {
        id_category_permission: '1',
        name: 'Cuti Tahunan'
      },
      {
        id_category_permission: '2',
        name: 'Cuti Sakit'
      },
      {
        id_category_permission: '3',
        name: 'Cuti Melahirkan'
      },
      {
        id_category_permission: '4',
        name: 'Cuti Melahirkan'
      },
      {
        id_category_permission: '5',
        name: 'Cuti Penting'
      },
      {
        id_category_permission: '6',
        name: 'Izin Lainya'
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('permission_categories', { id_category_permission: { [Op.in]: [1, 2, 3, 4, 5, 6] } });
  }
};
