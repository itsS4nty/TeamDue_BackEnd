// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);


// Variables
var conexion = connImport.crearConexion();


// Funciones
io.on("connection", (socket) => {
    console.log("Nueva conexion:", socket.id);

    socket.on("login", (data) => {
        conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE ? AND password LIKE ?", [data.user, data.password], function (err, result, fields) {
			if (results.length > 0) {
                console.log("Resultado encontrado");

			} else {
				console.log("No se ha encontrado ningun resultado");
                
			}
        });

    })
});
 


httpServer.listen(8080);