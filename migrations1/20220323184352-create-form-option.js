"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("formOptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      eventformId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "eventforms",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      formQuestionId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "formQuestions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("formOptions");
  },
};
