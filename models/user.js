'use strict';
const {hashPassword} = require("../helper/bcrypt")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey:"UserId"})
      User.belongsToMany(models.Doctor, { through: models.Appointment });
    }

    static genderName(gender) {
      return gender === 'Male' ? 'Mr.' : 'Ms.'
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
   
    user.password = hashPassword(user.password)
  })
  return User;
};