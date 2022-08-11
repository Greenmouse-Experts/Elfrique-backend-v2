"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "evisas",
          "approval_status",
          {
            allowNull: false,
            type: Sequelize.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("evisas", "approval_status", {
          transaction: t,
        }),
      ]);
    });
  },
};
