'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("subprices", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
      sub_type:{
        type: Sequelize.ENUM,
        values: ["basic", "exclusive", "home_page_left", "home_page_right", "home_page_slide", "inner_page_left", "inner_page_right" ],
        defaultValue: null
      },
      price: {
        type: Sequelize.STRING,
      },
      interval: {
        type: Sequelize.STRING,
      },
      plan_id: {
        type: Sequelize.STRING,
      },
      plan_code:{
        type: Sequelize.STRING,
      },
      page_url: {
        type: Sequelize.STRING,
      },
      page_id: {
        type: Sequelize.STRING,
      },
        createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
        updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
  
      })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("subprices");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
