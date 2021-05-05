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
    }
  };
  Usuarios.init({
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    correo: DataTypes.STRING,
    usuario: DataTypes.STRING,
    password: DataTypes.STRING,
    fecha_registro: DataTypes.DATE,
    premium: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Usuarios',
  });
  return Usuarios;
};