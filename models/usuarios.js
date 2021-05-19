'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuarios.hasMany(models.Logs, {as: 'Logs'});
      Usuarios.hasMany(models.Archivos, {as: 'Archivos'});
      Usuarios.hasMany(models.ConfiguracionEditor, {as: 'ConfiguracionEditor'});
    }
  };
  Usuarios.init({
    nombre: DataTypes.STRING,
    apellido1: DataTypes.STRING,
    apellido2: DataTypes.STRING,
    correo: DataTypes.STRING,
    usuario: DataTypes.STRING,
    password: DataTypes.STRING,
    fecha_registro: DataTypes.DATE,
    premium: DataTypes.BOOLEAN,
    validado: DataTypes.BOOLEAN
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Usuarios',
  });


  module.exports = Usuarios;
  return Usuarios;
};