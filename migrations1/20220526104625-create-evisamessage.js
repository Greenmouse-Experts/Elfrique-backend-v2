"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("evisamessages", {
      id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
      },
      message: {
        type: Sequelize.TEXT,
      },
      receiver_email: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("evisamessages");
  },
};
