const { Sequelize } = require('sequelize');
const { database } = require('../config/configure.js');

const sequelize = new Sequelize (
    database.database,
    database.username,
    database.password, {
        host: database.host,
        dialect: "mysql"
    }
);

sequelize.sync({ force:false }).then(() => {
    console.log("Conexion a la base de datos establecida con exito")

}).catch(error => {
    console.log("No se ha podido establecer conexion con la base de datos", error);

})

module.exports = sequelize;