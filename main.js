// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
const {Server} = require("socket.io"), server = new Server(8000);


// Variables
var conexion = connImport.crearConexion;


// Funciones
conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
    
});

io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("login", (data) => {
        console.log(data.nombre);

    })
});
  
httpServer.listen(8080);