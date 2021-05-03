const mysql = require('mysql');

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

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

io.on("connection", (socket) => {
    console.log("Cliente conectado");
  });
  
httpServer.listen(8080);