'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    // get formattedDate(){
    //   const date = new Date(this.dateAppointment.toString())
    //   const day = String(date.getDate()).padStart(2, '0');
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const year = date.getFullYear();

    //   const hour = String(date.getHours()).padStart(2, '0');
    //   const minute = String(date.getMinutes()).padStart(2, '0');
    //   const second = String(date.getSeconds()).padStart(2, '0');

    //   const formattedDate = `${day}--${month}--${year} ${hour}:${minute}:${second}`
    //   return date.slice(0,10)
    // }
  }
  Appointment.init({
    dateAppointment: {
      type:DataTypes.DATE,
      allowNull:false,
      validate:{
       notNull:{msg: "Date cannot be empty"},
       notEmpty:{msg: "Date cannot be empty"}
      }
    },
    symtomName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
       notNull:{msg: "Symtom cannot be empty"},
       notEmpty:{msg: "Symtom cannot be empty"}
      }
    },
    UserId: DataTypes.INTEGER,
    DoctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};