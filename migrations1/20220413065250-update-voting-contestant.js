"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    [
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */

      queryInterface.addColumn(
        "contestants", // table name
        "voteCount", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        "awardNominees", // table name
        "voteCount", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        }
      ),
    ];
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     *
     */
    return Promise.all([
      queryInterface.removeColumn("contestants", "VoteCount"),
      queryInterface.removeColumn("awardNominees", "VoteCount"),
    ]);
  },
};
