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
        groupId: 1,
        venueId: 1,
        name: "Tennis Group First Meet and Greet",
        type: "Online",
        capacity: 10,
        price: 18.50,
        description: "The first meet and greet for our group! Come say hello!",
        startDate: "2023-11-19 20:00:00",
        endDate: "2023-11-19 22:00:00",
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Soccer Group First Meet and Greet",
        type: "Online",
        capacity: 10,
        price: 18.50,
        description: "The second meet and greet for our group! Come say hello!",
        startDate: "2023-10-19 20:00:00",
        endDate: "2023-10-19 22:00:00",
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Volleyball Group First Meet and Greet",
        type: "Online",
        capacity: 10,
        price: 18.50,
        description: "The third meet and greet for our group! Come say hello!",
        startDate: "2023-12-19 20:00:00",
        endDate: "2023-12-19 22:00:00",
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
