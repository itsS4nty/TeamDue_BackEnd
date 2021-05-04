// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
const {Server} = require("socket.io"), server = new Server(8000);


// Variables
var conexion = connImport.crearConexion();


// Funciones

io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("login", (data) => {
        // console.log(data.nombre);
        var login = connImport.consultaLogin(conexion, data.nombre, data.password);
    })
});
  
httpServer.listen(8080);