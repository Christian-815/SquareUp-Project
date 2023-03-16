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
        url: "https://www.logolynx.com/images/logolynx/f7/f7352f6ccf93e7568c1ab0769d8b4366.jpeg",
        preview: true
      },
      {
        groupId: 1,
        url: "https://cdn.shoplightspeed.com/shops/614410/files/16885310/take-a-tour-of-the-store.jpg",
        preview: false
      },
      {
        groupId: 1,
        url: "https://fastly.4sqi.net/img/general/600x600/51047660_R3QtjarJwJgRp07N2Q3LBafd1MJ6v4I6eJIobiycmAY.jpg",
        preview: false
      },
      {
        groupId: 2,
        url: "https://upload.wikimedia.org/wikipedia/en/e/e9/Street_Fighter_Logo.png",
        preview: true
      },
      {
        groupId: 2,
        url: "https://s3.amazonaws.com/prod-media.gameinformer.com/styles/body_default/s3/2019/04/24/fdbba4f3/03_super_street_fighter_ii_turbo_06.png",
        preview: false
      },
      {
        groupId: 3,
        url: "https://www.pngmart.com/files/3/Injustice-Logo-PNG-File.png",
        preview: true
      },
      {
        groupId: 3,
        url: "https://i.pinimg.com/originals/22/2f/33/222f3327408a4656107c4c887a787cb1.jpg",
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
