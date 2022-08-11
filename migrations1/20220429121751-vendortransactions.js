'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("vendortransactions", {
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
      ref_no: {
          type: Sequelize.STRING
      },
      sub_type: {
          type: Sequelize.STRING
      },
      price: {
          type: Sequelize.STRING
      },
      interval: {
          type: Sequelize.STRING
      },
      status:{
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date:{
          type: Sequelize.DATE
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
    await queryInterface.dropTable("vendortransactions");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
