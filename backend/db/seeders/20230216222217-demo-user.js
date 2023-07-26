'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Christian',
        lastName: 'Oviedo',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Chris',
        lastName: 'Oviedooo',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Christopher',
        lastName: 'Oviedooooo',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        username: 'JaneS',
        hashedPassword: bcrypt.hashSync('pa$$w0rd')
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@email.com',
        username: 'MikeJ',
        hashedPassword: bcrypt.hashSync('secure123')
      },
      {
        firstName: 'Amanda',
        lastName: 'Lee',
        email: 'amanda.lee@email.com',
        username: 'AmandaL',
        hashedPassword: bcrypt.hashSync('amanda987')
      },
      {
        firstName: 'David',
        lastName: 'Wang',
        email: 'david.wang@email.com',
        username: 'DaveW',
        hashedPassword: bcrypt.hashSync('davidpwd')
      },
      {
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@email.com',
        username: 'EmiChen',
        hashedPassword: bcrypt.hashSync('emily123')
      },
      {
        firstName: 'Robert',
        lastName: 'Ramirez',
        email: 'robert.ramirez@email.com',
        username: 'RobRam',
        hashedPassword: bcrypt.hashSync('rrpwd456')
      },
      {
        firstName: 'Jessica',
        lastName: 'Kim',
        email: 'jessica.kim@email.com',
        username: 'JessK',
        hashedPassword: bcrypt.hashSync('jkim789')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: [
          'Demo-lition',
          'FakeUser1',
          'FakeUser2',
          'JaneS',
          'MikeJ',
          'AmandaL',
          'DaveW',
          'EmiChen',
          'RobRam',
          'JessK'
        ] }
    }, {});
  }
};
