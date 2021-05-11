// Imports
const connImport = require('./database.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);
const express = require('express');


// Variables
const app = express();
// var conexion = connImport.crearConexion();
var gameRooms = [];


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
        // console.log(socket.id, "entrando por: canvas-data");
        socket.broadcast.emit("canvas-data", data);
    });

    socket.on("peticionSala-enviada", (room) => {
        console.log(socket.id + " entrando por peticionSala-enviada");
        for (var i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomKey == room) {
                console.log(socket.id + " ha enviado una peticion a la room con id " + room + " exitosamente.");
                data = {
                    roomKey: gameRooms[i].roomKey,
                    administrator: gameRooms[i].administrator,
                    idPeticion: socket.id
                };
                io.to(gameRooms[i].administrator).emit("peticion-recibida", data);
            }
        }

        return socket.emit("err", "La clave " + room + " es incorrecta.");
    });


    socket.on("join-room", (data) => {
        console.log(socket.id + " entrando por join-room para que el socket con id " + data.idPeticion + " pueda entrar");

        // socket.join(room);
        // io.to(data.idPeticion).join(data.roomKey);
        console.log(data.idPeticion + " se ha unido a la sala con key " + data.roomKey + " exitosamente.");
        return io.to(data.idPeticion).emit("entrando-sala", data.roomKey);
    });

    socket.on("new-room", (roomKey) => {
        console.log(socket.id + " entrando por new-room");
        for (var i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomKey == roomKey) {
                return socket.emit("err", "La room con la clave " + roomKey + " ya existe.");

            }
        }

        roomInformation = {
            roomKey: roomKey,
            administrator: socket.id
        };
        gameRooms.push(roomInformation);
        socket.join(roomKey);
        console.log(socket.id + " ha creado con exito la sala con key " + roomKey);
        return socket.emit("sala-creada", "Sala creada con la key: " + roomKey + " el administrador es el socket con id: " + roomInformation.administrator);
    });
});
 
