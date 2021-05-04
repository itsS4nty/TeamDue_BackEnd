// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);
const express = require('express');
const app = express();

// Variables
var conexion = connImport.crearConexion();


// Funciones
app.listen(3000, () => {
    console.log("Server API on port 3000");

});

httpServer.listen(8080, () => {
    console.log("Server app on port 8080");
});

io.on("connection", (socket) => {
    console.log("Nueva conexion:", socket.id);

    socket.on("login", (data) => {
        conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE ? AND password LIKE ? LIMIT 1", [data.user, data.password], function (err, result, fields) {
            if (err) {
                console.log("Error", err);
                socket.emit("loginResponse", false);
            }

			if (result.length == 1) {
                console.log("Resultado encontrado");
                socket.emit("loginResponse", true, result[0]);

			} else {
				console.log("No se ha encontrado ningun resultado");
                socket.emit("loginResponse", false);

			}
        });

    })
});
 
