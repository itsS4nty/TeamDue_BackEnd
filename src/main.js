// Imports
const connImport = require('./database.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);
const express = require('express');


// Variables
const app = express();
// var conexion = connImport.crearConexion();


// Settings
app.set("port", 3000 || process.env.PORT);


// Middlewares
app.use(express.json());


// Routes
app.use(require("./routes/teamdueapi"));


// Servidores
app.listen(app.get("port"), () => {
    console.log("Server API on port", app.get("port"));

});

httpServer.listen(8080, () => {
    console.log("Server app on port 8080");
});


// Sockets
io.on("connection", (socket) => {
    console.log("Nueva conexion:", socket.id);

    socket.on("canvas-data", (data) => {
        console.log(socket.id, "entrando por: canvas-data");
        socket.broadcast.emit("canvas-data", data);


        // conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE ? AND password LIKE ? LIMIT 1", [data.user, data.password], function (err, result, fields) {
        //     if (err) {
        //         console.log("Error", err);
        //         socket.emit("loginResponse", false);
        //     }

		// 	if (result.length == 1) {
        //         console.log("Resultado encontrado");
        //         socket.emit("loginResponse", true, result[0]);

		// 	} else {
		// 		console.log("No se ha encontrado ningun resultado");
        //         socket.emit("loginResponse", false);

		// 	}
        // });

    })
});
 
