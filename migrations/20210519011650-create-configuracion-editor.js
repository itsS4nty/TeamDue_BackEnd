'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConfiguracionEditor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombreFiltro: {
        allowNull: false,
        type: Sequelize.STRING
      },
      brillo: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      saturacion: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      difuminacion: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sepia: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contraste: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      UsuarioId: {
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        allowNull: false,
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('ConfiguracionEditors');
  }
};