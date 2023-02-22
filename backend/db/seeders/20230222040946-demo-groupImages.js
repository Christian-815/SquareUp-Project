'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "GroupImages";


module.exports = {
  async up (queryInterface, Sequelize) {
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
        url: "image.png",
        preview: true
      },
      {
        groupId: 1,
        url: "image2.png",
        preview: false
      },
      {
        groupId: 2,
        url: "image.png",
        preview: true
      },
      {
        groupId: 2,
        url: "image2.png",
        preview: false
      },
      {
        groupId: 3,
        url: "image.png",
        preview: true
      },
      {
        groupId: 3,
        url: "image2.png",
        preview: false
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
