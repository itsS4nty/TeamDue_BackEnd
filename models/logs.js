'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Logs.belongsTo(models.Usuarios, {foreignKey: 'usuario_id', as: 'Usuarios'});
    }
  };
  Logs.init({
    accion: DataTypes.STRING,
    fecha: DataTypes.DATE,
    usuario_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Logs',
  });

  module.exports = Logs;
  return Logs;
};