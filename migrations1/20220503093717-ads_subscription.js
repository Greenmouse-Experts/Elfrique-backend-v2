'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("adssubscriptions", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
        userId:{
          type: Sequelize.STRING,
          references:{ 
            model: 'adminusers',
            key: 'id',
        }
      },
      sub_type:{
        type: Sequelize.ENUM,
        values: ["home_page_left", "home_page_right", "home_page_slide", "inner_page_left", "inner_page_right"],
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "expired"],
        defaultValue: null
        
      },
      end_date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("adssubscriptions");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
