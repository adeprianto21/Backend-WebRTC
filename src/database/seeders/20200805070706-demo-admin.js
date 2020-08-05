'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('Admins', [
      {
        id: 1,
        name: 'Admin',
        username: 'admin',
        password:
          '$2b$12$b/95T7PGPDj5WaP7uAt6RukboUu2hrVW/bCyKHViLnb.8HDr18VYe', // 12345678
        email: 'admin@tes.com',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
