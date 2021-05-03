const mysql = require('mysql');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var conexion = mysql.createConnection({
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

server.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
});

app.get('/' , (req , res)=>{

   res.send('Hola');

})

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    io.on("login", (data) => {


    })
});