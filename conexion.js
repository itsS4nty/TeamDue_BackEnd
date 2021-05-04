function crearConexion() {
    const mysql = require('mysql');

    var conexion = mysql.createConnection({
        host : 'localhost',
        database : 'TeamDue',
        user : 'Carlos',
        password : 'Admin123'});
    
    return conexion;
}

exports.crearConexion = crearConexion;