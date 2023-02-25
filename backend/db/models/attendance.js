'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, {foreignKey: 'eventId'});
      Attendance.belongsTo(models.User, {foreignKey: 'userId'});
    }
  }
  Attendance.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete:"CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: "cascade"
    },
    status: {
      type: DataTypes.ENUM("member", "waitlist", "pending", "attending"),
      allowNull: false,
      validate: {
        validType(value) {
          if (value !== 'waitlist' && value !== "member" && value !== 'pending' && value !== 'attending') {
            throw new Error("Type must be waitlist, member, pending, or attending")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
