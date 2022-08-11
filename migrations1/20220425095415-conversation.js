'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("conversations", {
      id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
      },
      senderId:{
        type: Sequelize.STRING,
      },
      receiverId: {
        type: Sequelize.STRING,
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      read_status: {
          allowNull: true,
          type: Sequelize.BOOLEAN,
          defaultValue: false
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
    await queryInterface.dropTable("conversations");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
