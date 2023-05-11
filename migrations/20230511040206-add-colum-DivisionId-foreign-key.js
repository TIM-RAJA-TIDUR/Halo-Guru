'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Doctors", "DivisionId", {
      type :Sequelize.DataTypes.INTEGER,
      references:{
        model: {
          tableName: "Divisions"
        },
        key: "id"
      }
    })
    /**
     * Add altering commands here.
     *
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     * Example:
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Doctors", "DivisionId")
    /**
     * Add reverting commands here.
     *
     * await queryInterface.dropTable('users');
     * Example:
     */
  }
};
