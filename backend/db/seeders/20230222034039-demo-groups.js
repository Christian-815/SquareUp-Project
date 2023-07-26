'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Groups";


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
      },
      {
        organizerId: 4,
        name: "Mortal Kombat Masters",
        about: "Test your might in epic battles of Mortal Kombat. Whether you're a seasoned warrior or a newcomer, join us for intense 1v1 combat and fatalities!",
        type: "In person",
        private: false,
        city: "Chicago",
        state: "IL"
      },
      {
        organizerId: 5,
        name: "Tekken Titans",
        about: "Step into the King of Iron Fist Tournament! Unleash your martial arts skills in Tekken 7 and show everyone why you deserve to be the champion.",
        type: "In person",
        private: false,
        city: "Los Angeles",
        state: "CA"
      },
      {
        organizerId: 6,
        name: "Dragon Ball Z Showdown",
        about: "Enter the world of Dragon Ball Z and engage in epic battles as your favorite Z Fighters. Charge up your ki and join us for intense 3v3 matches!",
        type: "Online",
        private: true,
        city: "Houston",
        state: "TX"
      },
      {
        organizerId: 7,
        name: "Smashers Unite - Ultimate Edition",
        about: "Experience the ultimate crossover in Super Smash Bros. Ultimate! Join our diverse community of players for fun-filled and competitive matches.",
        type: "In person",
        private: false,
        city: "Miami",
        state: "FL"
      },
      {
        organizerId: 8,
        name: "SoulCalibur Clash",
        about: "Unleash the power of the Soul Edge! Engage in weapon-based combat in SoulCalibur VI and prove your mastery with your favorite characters.",
        type: "In person",
        private: true,
        city: "Seattle",
        state: "WA"
      },
      {
        organizerId: 9,
        name: "Guilty Gear Strive Society",
        about: "Rock the world with fast-paced action in Guilty Gear Strive! Gear up for intense battles and flashy combos with our dedicated group of players.",
        type: "Online",
        private: false,
        city: "Boston",
        state: "MA"
      },
      {
        organizerId: 10,
        name: "Brawlhalla Brawlers",
        about: "Join the chaotic platform fighting in Brawlhalla! Pick your legend, grab a weapon, and fight your way to victory in this epic free-for-all.",
        type: "Online",
        private: true,
        city: "San Francisco",
        state: "CA"
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
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
