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
        conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE ? AND password LIKE ? LIMIT 1", [data.user, data.password], function (err, result, fields) {
            if (err) {
                console.log("Error", err);
            }

			if (result.length == 1) {
                console.log("Resultado encontrado", result[0]);
                // socket.emit("loginResponse", true)

			} else {
				console.log("No se ha encontrado ningun resultado");

			}
        });

    })
});
 


httpServer.listen(8080);