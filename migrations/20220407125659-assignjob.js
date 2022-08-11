'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("assignjobs", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
      eventjobId:{
          type: Sequelize.STRING(10),
          references:{ 
              model: 'eventjobs',
              key: 'id',
          }
      },
      userId: {
        type: Sequelize.STRING,
        references:{ 
            model: 'adminusers',
            key: 'id',
        }
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
    await queryInterface.dropTable("assignjobs");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
