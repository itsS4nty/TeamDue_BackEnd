'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConfiguracionUsuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ConfiguracionUsuario.init({
    tema_oscuro: DataTypes.BOOLEAN,
    mandar_correo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ConfiguracionUsuario',
  });
  return ConfiguracionUsuario;
};