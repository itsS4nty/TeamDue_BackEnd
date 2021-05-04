// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);


// Variables
var conexion = connImport.crearConexion();
const session_handler = require('io-session-handler').from(io, { timeout: 5000 });

// Funciones
// io.on("connection", (socket) => {
//     console.log("Nueva conexion:", socket.id);

//     socket.on("login", (data) => {
//         conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE '" + data.user + "' AND password LIKE '" + data.password + "'", function (err, result, fields) {
//             if (err) {
//                 console.error('Error de consulta: ' + err.stack);
//                 return;
//             }

//             console.log(result);
//             // socket.emit
//         });

//     })
// });
 
session_handler.connectionListener((connection) => {
    console.log(connection);
});


httpServer.listen(8080);