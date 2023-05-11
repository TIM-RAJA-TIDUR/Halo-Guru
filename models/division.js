'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Division.hasMany(models.Doctor, {foreignKey:"DivisionId"})
    }
  }
  Division.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Division',
  });
  return Division;
};