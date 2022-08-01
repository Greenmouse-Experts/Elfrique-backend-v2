'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("vendorsubs", {
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
        values: ["free", "basic", "exclusive"],
        defaultValue: "free"
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "expired"],
        defaultValue: null,
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
    await queryInterface.dropTable("vendorsubs");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
