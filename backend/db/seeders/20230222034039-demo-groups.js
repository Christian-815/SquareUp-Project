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
       name: "Evening Tennis on the Water",
       about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
       type: "In person",
       private: true,
       city: "New York",
       state: "NY"
     },
     {
       organizerId: 2,
       name: "Evening Soccer on the Water",
       about: "Enjoy rounds of soccer with a tight-nit group of people on the water facing the Brooklyn Bridge.",
       type: "In person",
       private: true,
       city: "New York",
       state: "NY"
     },
     {
       organizerId: 3,
       name: "Evening Volleyball on the Water",
       about: "Enjoy rounds of Volleyball with a tight-nit group of people on the water facing the Brooklyn Bridge.",
       type: "In person",
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
