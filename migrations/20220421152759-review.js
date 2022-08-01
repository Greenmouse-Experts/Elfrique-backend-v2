'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("reviews", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
      jobId: {
        type: Sequelize.STRING,
        references:{ 
            model: 'eventjobs',
            key: 'id',
        }
      },
      from: {
          type: Sequelize.STRING,
          references:{ 
              model: 'adminusers',
              key: 'id',
          }
      },
      to:  {
          type: Sequelize.STRING,
          references:{ 
              model: 'adminusers',
              key: 'id',
          }
      },
      text: {
          type: Sequelize.TEXT,
      },
      rating: {
          type: Sequelize.FLOAT
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
    await queryInterface.dropTable("reviews");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
