const mysql = require('mysql');
const objetoConexion = {};
const conexion = mysql.createConnection({
    host : 'localhost',
    database : 'TeamDue',
    user : 'Carlos',
    password : 'Admin123'
});

conexion.connect(function (err){
    if (err) {
        console.log(err);
        return;

    }else {
        console.log("Base de datos conectada");

    }
});

module.exports = conexion;
// exports.crearConexion = crearConexion;