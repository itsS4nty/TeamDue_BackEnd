'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConfiguracionEditor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConfiguracionEditor.belongsTo(models.Usuarios, {foreignKey: 'UsuarioId', as: 'Usuarios'});
    }
  };
  ConfiguracionEditor.init({
    nombreFiltro: DataTypes.STRING,
    brillo: DataTypes.INTEGER,
    saturacion: DataTypes.INTEGER,
    difuminacion: DataTypes.INTEGER,
    sepia: DataTypes.INTEGER,
    contraste: DataTypes.INTEGER,
    UsuarioId: DataTypes.INTEGER
  }, {
    timestamps: false,
    sequelize,
    modelName: 'ConfiguracionEditor',
  });
  module.exports = ConfiguracionEditor;
  return ConfiguracionEditor;
};