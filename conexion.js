const objetoConexion = {};

function crearConexion() {
    const mysql = require('mysql');

    var conexion = mysql.createConnection({
        host : 'localhost',
        database : 'TeamDue',
        user : 'Carlos',
        password : 'Admin123'
    });

    return conexion;
}

function consultaLogin(conn, user, password) {
    conn.connect(function(err) {
        if (err) {
            console.error('Error de conexion: ' + err.stack);
            return;
        }
        console.log('Conectado con el identificador ' + conn.threadId);

        conn.query("SELECT * FROM Usuarios WHERE usuario LIKE " + user + " AND password LIKE " + password, function (err, result, fields) {
            if (err) {
                console.error('Error de consulta: ' + err.stack);
                return;
            }

            console.log(result);
            return true;
        });
    });
}

exports.crearConexion = crearConexion;
exports.consultaLogin = consultaLogin;