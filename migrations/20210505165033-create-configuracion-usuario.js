'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConfiguracionUsuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tema_oscuro: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      mandar_correo: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('ConfiguracionUsuarios');
  }
};