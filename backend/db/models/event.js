'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Event.belongsTo(models.Group, {foreignKey: 'groupId'});
      // Event.belongsTo(models.Venue, {foreignKey: 'venueId'});
      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId',
        onDelete: "cascade"
      });
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'cascade'
      });
      Event.belongsTo(models.Group, {foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'});
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Venues',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 30]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false,
      validate: {
        validType(value) {
          if (value !== 'Online' || value !== "In person") {
            throw new Error("Type must be Online or In person")
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,

    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,

    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
