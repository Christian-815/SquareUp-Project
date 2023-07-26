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
        url: "https://cdn.vox-cdn.com/thumbor/JDgcZt3YGs3vkhr6eAE7akAX7cw=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/assets/3558727/injustice_ultimate_edition.jpg",
        preview: true
      },
      {
        eventId: 3,
        url: "https://media.moddb.com/images/articles/1/180/179608/auto/injustice__gods_among_us_by_sblister-d5yok5j.jpg",
        preview: false
      },
      {
        eventId: 4,
        url: "https://i.ebayimg.com/images/g/ffYAAOSw01Zi52Mr/s-l1200.jpg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://i.ytimg.com/vi/bA49WgGOKp4/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 6,
        url: "https://www.fightersgeneration.com/nf/game/dragonballfighterz/oct/dragonballfighterz-oct2017-screenshot.jpg",
        preview: true
      },
      {
        eventId: 7,
        url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Mortal_Kombat_Logo.svg/1200px-Mortal_Kombat_Logo.svg.png",
        preview: true
      },
      {
        eventId: 8,
        url: "https://www.smashbros.com/assets_v2/img/top/hero05_en.jpg",
        preview: true
      },
      {
        eventId: 9,
        url: "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2019/10/Webp.net-resizeimage-1.jpg",
        preview: true
      },
      {
        eventId: 10,
        url: "https://www.guiltygear.com/ggst/en/wordpress/wp-content/themes/ggst/img/top/mode_slide03_thumb.jpg",
        preview: true
      },
      {
        eventId: 11,
        url: "https://play-lh.googleusercontent.com/np6vjq7-1UEN0rhoO2D5KFWD_u_2ve_od6YzlAUnq2Ty_lR6HBGB-Qsu_E5jS3VI-m5t",
        preview: true
      },
      {
        eventId: 12,
        url: "https://cdn.akamai.steamstatic.com/steam/apps/1498570/capsule_616x353.jpg?t=1684220665",
        preview: true
      },
      {
        eventId: 13,
        url: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/b/blazblue-cross-tag-battle-switch/hero",
        preview: true
      },
      {
        eventId: 14,
        url: "https://assets.altarofgaming.com/wp-content/uploads/2020/12/Injustice-Gods-Among-Us-Screenshot-2020.12.31-13.16.24.74.jpg",
        preview: true
      },
      {
        eventId: 15,
        url: "https://i.ytimg.com/vi/uvXWGfPxoAI/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 16,
        url: "https://cdn.cloudflare.steamstatic.com/steam/apps/245170/capsule_616x353.jpg?t=1680117275",
        preview: true
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
