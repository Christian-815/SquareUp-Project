'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Groups";


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
       organizerId: 1,
       name: "Brothers of Smash",
       about: "Enjoy rounds of 1v1 matches of Super Smash Bros. Melee with a tight-nit group of competitive people at our local gaming bar. 3-stock or 5-stock.",
       type: "In person",
       private: true,
       city: "San Jose",
       state: "CA"
     },
     {
       organizerId: 2,
       name: "Lovers in the sheets, Fighters in the Streets",
       about: "Enjoy rounds of Street Fighter with our friendly group of people at the local arcade. We have pros and casual players so whatever type of competitiveness you're looking for, we got it!",
       type: "In person",
       private: false,
       city: "San Diego",
       state: "CA"
     },
     {
       organizerId: 3,
       name: "Justice of Injustice",
       about: "Enjoy rounds of Injustice with a tight-nit group of people just trying to get better at the game. We play both Injustice 1 and 2 so all are welcome!",
       type: "Online",
       private: true,
       city: "New York",
       state: "NY"
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
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
