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
        url: "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/gamecube_12/SI_GCN_SuperSmashBrosMelee.jpg",
        preview: true
      },
      {
        eventId: 1,
        url: "https://ssb.wiki.gallery/images/0/03/Final_Destination_Melee.png",
        preview: false
      },
      {
        eventId: 2,
        url: "https://cdn.cloudflare.steamstatic.com/steam/apps/310950/capsule_616x353.jpg?t=1671156599",
        preview: true
      },
      {
        eventId: 2,
        url: "https://hb.imgix.net/ce29993ad8f2fd594cfb5dc8e27cae684546f7b2.jpeg?auto=compress,format&fit=crop&h=353&w=616&s=125db18a764887fca5a9bba002bf790f",
        preview: false
      },
      {
        eventId: 3,
        url: "https://www.kotaku.com.au/wp-content/uploads/sites/3/2017/05/injustice-2.jpg?quality=80&resize=1280,720",
        preview: true
      },
      {
        eventId: 3,
        url: "https://media.moddb.com/images/articles/1/180/179608/auto/injustice__gods_among_us_by_sblister-d5yok5j.jpg",
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
