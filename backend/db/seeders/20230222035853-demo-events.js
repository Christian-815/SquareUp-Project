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
        venueId: 1,
        groupId: 1,
        name: "Final Destination Showdown",
        description: "Come join us for some competitive 4-stock battles with friends. Bring your own controller if you want, but if not we have some spares!",
        type: "In Person",
        capacity: 20,
        price: 0.00,
        startDate: "2023-03-22 18:00:00",
        endDate: "2023-03-22 20:00:00",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Street Fight, but Online!",
        description: "Having some practice sessions from home to get ready for competition. We have novice to pro players so join us to get some practice!",
        type: "Online",
        capacity: 50,
        price: 0.00,
        startDate: "2023-03-25 20:00:00",
        endDate: "2023-03-25 22:00:00",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "The Battle for Heroes, or Villains",
        description: "This month's big competition! Winner and Losers bracket for novice, player, and pro. Come see if you can win it all and take home the prize money!",
        type: "In Person",
        capacity: 100,
        price: 20.00,
        startDate: "2023-03-26 16:00:00",
        endDate: "2023-03-26 22:00:00",
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Smash Bros Melee Mayhem",
        description: "Join us for an exciting night of Super Smash Bros. Melee battles. Bring your A-game and compete for glory!",
        type: "In Person",
        capacity: 30,
        price: 0.00,
        startDate: "2023-04-05 19:00:00",
        endDate: "2023-04-05 22:00:00",
      },
      {
        venueId: 1,
        groupId: 5,
        name: "Tekken Tag Tournament",
        description: "Gather your partner and team up for an epic Tekken Tag Tournament. Form the ultimate duo and fight for victory!",
        type: "In Person",
        capacity: 40,
        price: 0.00,
        startDate: "2023-08-10 15:00:00",
        endDate: "2023-08-10 18:00:00",
      },
      {
        venueId: 1,
        groupId: 6,
        name: "Dragon Ball FighterZ Frenzy",
        description: "Unleash your super moves in an intense Dragon Ball FighterZ showdown. Who will emerge as the ultimate Z Fighter?",
        type: "In Person",
        capacity: 25,
        price: 0.00,
        startDate: "2023-08-01 17:00:00",
        endDate: "2023-08-01 20:00:00",
      },
      {
        venueId: 1,
        groupId: 4,
        name: "Mortal Kombat Madness",
        description: "Test your might in a brutal Mortal Kombat tournament. Fatality your way to victory!",
        type: "In Person",
        capacity: 35,
        price: 0.00,
        startDate: "2023-07-20 18:30:00",
        endDate: "2023-07-20 21:30:00",
      },
      {
        venueId: 1,
        groupId: 7,
        name: "Smash Ultimate Showdown",
        description: "Experience the ultimate crossover in Super Smash Bros. Ultimate. Who will be crowned the Ultimate Champion?",
        type: "In Person",
        capacity: 50,
        price: 0.00,
        startDate: "2023-07-29 20:00:00",
        endDate: "2023-07-29 23:00:00",
      },
      {
        venueId: 1,
        groupId: 8,
        name: "SoulCalibur Showdown",
        description: "Unleash the power of the Soul Edge in an intense SoulCalibur VI tournament. Fight for honor and glory!",
        type: "In Person",
        capacity: 20,
        price: 0.00,
        startDate: "2023-08-28 17:00:00",
        endDate: "2023-08-28 19:00:00",
      },
      {
        venueId: 1,
        groupId: 9,
        name: "Guilty Gear Grand Battle",
        description: "Get ready for a high-octane battle in Guilty Gear Strive. Show your skills and claim victory!",
        type: "In Person",
        capacity: 30,
        price: 0.00,
        startDate: "2023-08-02 19:30:00",
        endDate: "2023-08-02 22:30:00",
      },
      {
        venueId: 1,
        groupId: 10,
        name: "Brawlhalla Brawl Fest",
        description: "Join the chaotic platform fighting in Brawlhalla. Brawl your way to the top and become the champion!",
        type: "In Person",
        capacity: 40,
        price: 0.00,
        startDate: "2023-08-06 16:00:00",
        endDate: "2023-08-06 19:00:00",
      },
      {
        venueId: 1,
        groupId: 10,
        name: "King of Fighters Clash",
        description: "Team up and fight in The King of Fighters XIV. Prove your team's supremacy in this epic clash!",
        type: "In Person",
        capacity: 60,
        price: 0.00,
        startDate: "2023-07-10 20:00:00",
        endDate: "2023-07-10 23:00:00",
      },
      {
        venueId: 1,
        groupId: 9,
        name: "BlazBlue Battlegrounds",
        description: "Embark on a BlazBlue journey filled with intense battles and astral finishes. Who will rewrite fate?",
        type: "In Person",
        capacity: 25,
        price: 0.00,
        startDate: "2023-07-14 18:30:00",
        endDate: "2023-07-14 21:00:00",
      },
      {
        venueId: 1,
        groupId: 3,
        name: "Injustice Invitational",
        description: "Choose your hero or villain and fight in an Injustice 2 tournament. Defend or conquer the world!",
        type: "In Person",
        capacity: 30,
        price: 0.00,
        startDate: "2023-08-18 17:30:00",
        endDate: "2023-08-18 20:30:00",
      },
      {
        venueId: 1,
        groupId: 4,
        name: "Dead or Alive Duel",
        description: "Engage in fast-paced battles in Dead or Alive 6. Prove your skill and become the ultimate fighter!",
        type: "In Person",
        capacity: 35,
        price: 0.00,
        startDate: "2023-05-22 19:00:00",
        endDate: "2023-05-22 22:00:00",
      },
      {
        venueId: 1,
        groupId: 6,
        name: "Skullgirls Skirmish",
        description: "Join the quirky cast of Skullgirls and battle it out for supremacy. Outsmart your opponents and win!",
        type: "In Person",
        capacity: 20,
        price: 0.00,
        startDate: "2023-05-26 15:00:00",
        endDate: "2023-05-26 18:00:00"
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
      groupId: {[Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }, {})
  }
};
