'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("messages", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
        conversationId: {
          type: Sequelize.STRING,
            references:{ 
                model: 'conversations',
                key: 'id',
            }
          
      },
        sender: {
          type: Sequelize.STRING,
          references:{ 
            model: 'adminusers',
            key: 'id',
        }
      },
        text: {
          type: Sequelize.TEXT,
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
    await queryInterface.dropTable("messages");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
