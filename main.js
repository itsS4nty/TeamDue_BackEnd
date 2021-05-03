const mysql = require('mysql');

var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'TeamDue',
    user : 'Carlos',
    password : 'Admin123',

});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);

});