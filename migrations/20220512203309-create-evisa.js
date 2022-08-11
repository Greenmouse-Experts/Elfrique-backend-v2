"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("evisas", {
      id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: Sequelize.TEXT,
      },
      dapart_date: {
        type: Sequelize.DATE,
      },
      return_date: {
        type: Sequelize.DATE,
      },
      visa_type: {
        type: Sequelize.STRING,
      },
      numberOfTravelers: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.TEXT,
      },
      additional_info: {
        type: Sequelize.TEXT,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("evisas");
  },
};
