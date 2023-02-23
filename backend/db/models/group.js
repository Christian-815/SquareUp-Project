'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // connecting groups to venue
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
      // Assigning an owner to each group
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
      // images for group
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
      Group.hasMany(models.Venue, {foreignKey: 'groupId'});
      Group.belongsTo(models.User, {foreignKey: 'organizerId'});
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 300]
      }
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
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkInput(value) {
          if (!value) {
            throw new Error("City is required")
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkInput(value) {
          if (!value) {
            throw new Error("State is required")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
