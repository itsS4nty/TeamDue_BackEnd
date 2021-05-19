'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      apellido1: {
        allowNull: false,
        type: Sequelize.STRING
      },      
      apellido2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      correo: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      usuario: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fecha_registro: {
        allowNull: false,
        type: Sequelize.DATE
      },
      premium: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      validado: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Usuarios');
  }
};