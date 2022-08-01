"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questionOptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      questionId: {
        type: Sequelize.STRING,
        references: {
          model: "questions",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      triviaId: {
        type: Sequelize.STRING,
        references: {
          model: "trivia",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      option: {
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
    await queryInterface.dropTable("questionOptions");
  },
};
