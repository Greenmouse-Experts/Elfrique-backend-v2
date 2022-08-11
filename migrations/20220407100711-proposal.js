'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("proposals", {
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
    jobId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'eventjobs',
            key: 'id',
        }
    },
    description: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.STRING
    },
    img_id: {
        type: Sequelize.STRING
    },
    img_url:{
        type: Sequelize.STRING
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
     * await queryInterface.createTable('users', { id: Sequelize.STRING });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("proposal");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
