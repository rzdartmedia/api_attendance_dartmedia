const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employees', [
      {
        id_employee: 'DMA-admin002',
        nik: '1234567891',
        name: 'admin2',
        position: 'admin',
        division: 'admin',
        gender: 'admin',
        npwp: null,
        place_of_birth: 'Jakarta',
        date_of_birth: '2023-01-02',
        address_ktp: 'Jakarta',
        address: 'Jakarta',
        no_hp: '081294124123',
        religion: 'admin',
        email_personal: 'admin2@dartmedia.com',
        email_employee: 'admin2@dartmedia.com',
        ptkp: 0,
        blood: 'A',
        photo_ktp: '/default/default-card.png',
        photo_npwp: null,
        photo_swa: '/default/1676533649755.jpg',
        name_family: 'Admin Dartmedia',
        connection_family: 'Admin Dartmedia',
        no_hp_family: '081242123222',
        address_family: 'Jakarta',
        status_employee: true,
        work_location: 'Jakarta',
      }
    ])

    await queryInterface.bulkInsert('users', [
      {
        id_user: 'user-000002',
        nik: '1234567891',
        password: await bcrypt.hash('Admindartmedia123', 10),
        status: true,
        role: 'admin',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id_user: 'user-000002' });
    await queryInterface.bulkDelete('employees', { id_employee: 'DMA-admin002' });
  }
};