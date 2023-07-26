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
        url: "https://www.injustice.com/img/share.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://i.pinimg.com/originals/22/2f/33/222f3327408a4656107c4c887a787cb1.jpg",
        preview: false
      },
      {
        groupId: 4,
        url: "https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/05/04/mortal-kombat-1-hub-date-details-e1684427028344.jpg",
        preview: true
      },
      {
        groupId: 5,
        url: "https://insider-gaming.com/wp-content/uploads/2023/05/tekken-8-cover.jpg",
        preview: true
      },
      {
        groupId: 6,
        url: "https://p325k7wa.twic.pics/high/dragon-ball/dragonball-fighters-z/00-page-setup/dbfz_game-thumbnail.jpg?twic=v1/resize=760/step=10/quality=80",
        preview: true
      },
      {
        groupId: 7,
        url: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9",
        preview: true
      },
      {
        groupId: 8,
        url: "https://cdn.cloudflare.steamstatic.com/steam/apps/544750/capsule_616x353.jpg?t=1646956219",
        preview: true
      },
      {
        groupId: 9,
        url: "https://cdn.akamai.steamstatic.com/steam/apps/1384160/header.jpg?t=1685004154",
        preview: true
      },
      {
        groupId: 10,
        url: "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Brawlhalla.jpg",
        preview: true
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
