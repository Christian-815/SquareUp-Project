'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Events";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Final Destination Showdown",
        description: "Come join us for some competitive 4-stock battles with friends. Bring your own controller if you want, but if not we have some spares!",
        type: "In Person",
        capacity: 20,
        price: 0.00,
        startDate: "2023-03-22 18:00:00",
        endDate: "2023-03-22 20:00:00",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Street Fight, but Online!",
        description: "Having some practice sessions from home to get ready for competition. We have novice to pro players so join us to get some practice!",
        type: "Online",
        capacity: 50,
        price: 0.00,
        startDate: "2023-03-25 20:00:00",
        endDate: "2023-03-25 22:00:00",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "The Battle for Heroes, or Villains",
        description: "This month's big competition! Winner and Losers bracket for novice, player, and pro. Come see if you can win it all and take home the prize money!",
        type: "In Person",
        capacity: 100,
        price: 20.00,
        startDate: "2023-03-26 16:00:00",
        endDate: "2023-03-26 22:00:00",
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: {[Op.in]: [1, 2, 3]}
    }, {})
  }
};
