'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archivos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Archivos.belongsTo(models.Usuarios, {foreignKey: 'usuario_id', as: 'Usuarios'});
    }
  };
  Archivos.init({
    nombre: DataTypes.STRING,
    tipo: DataTypes.STRING,
    UsuarioId: DataTypes.INTEGER
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Archivos',
  });
  module.exports = Archivos;
  return Archivos;
};