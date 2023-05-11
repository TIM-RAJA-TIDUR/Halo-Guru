'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "UserId", {
      type :Sequelize.DataTypes.INTEGER,
      references:{
        model: {
          tableName: "Users"
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
    await queryInterface.removeColumn("Profiles", "UserId")
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
