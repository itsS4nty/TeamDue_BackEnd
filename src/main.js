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
        if (gameRooms.includes(room)) {

            
        }else {
            socket.emit("err", "La clave " + room + " es incorrecta.");
        }

    });


    socket.on("join-room", (room) => {
        console.log(socket.id + " entrando por join-room");
        if(gameRooms.includes(room)) {
            socket.join(room);
            console.log(socket.id + " se ha unido a la sala con key " + room + " exitosamente.");
            socket.emit("entrando-sala", room);

        }else {
            socket.emit("err", "La clave " + room + " es incorrecta.");

        }

    });

    socket.on("new-room", (roomKey) => {
        console.log(socket.id + " entrando por new-room");
        for (var i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomInformation.roomKey == roomKey) {
                console.log("devuelto");
                socket.emit("err", "La room con la clave " + roomKey + " ya existe.");

            }
        }

        roomInformation = {
            roomKey: roomKey,
            administrator: socket.id
        };
        gameRooms.push(roomInformation);
        socket.join(roomKey);
        console.log(socket.id + " ha creado con exito la sala con key " + roomKey);
        socket.emit("sala-creada", "Sala creada con la key: " + roomKey + " el administrador es el socket con id: " + roomInformation.administrator);

        // if (gameRooms.includes(roomKey)) {
        //     socket.emit("err", "La room con la clave " + roomKey + " ya existe.");

        // }else {
        //     roomInformation = {
        //         roomKey: roomKey,
        //         administrator: socket.id
        //     };
        //     gameRooms.push(roomInformation);
        //     socket.join(roomKey);
        //     console.log(socket.id + " ha creado con exito la sala con key " + roomKey);
        //     socket.emit("sala-creada", "Sala creada con la key: " + roomKey + " el administrador es el socket con id: " + roomInformation.administrator);

        // }
    });
});
 
