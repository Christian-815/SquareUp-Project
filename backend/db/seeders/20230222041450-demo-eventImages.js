'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "EventImages";


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
        eventId: 1,
        url: "image.png",
        preview: true
      },
      {
        eventId: 1,
        url: "image2.png",
        preview: false
      },
      {
        eventId: 2,
        url: "image.png",
        preview: true
      },
      {
        eventId: 2,
        url: "image2.png",
        preview: false
      },
      {
        eventId: 3,
        url: "image.png",
        preview: true
      },
      {
        eventId: 3,
        url: "image2.png",
        preview: false
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
      eventId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
