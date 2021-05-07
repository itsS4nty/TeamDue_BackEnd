// Imports
const connImport = require('./database.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
// const {Server} = require("socket.io"), server = new Server(8000);
const express = require('express');


// Variables
const app = express();
// var conexion = connImport.crearConexion();
var rooms = [];


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

    socket.on("join-room", (room) => {
        if(gameRooms.includes(room)) {
            socket.join(room);
            console.log(socket.id + " se ha unido a la sala con key " + room + " con exito.");
            socket.emit("success", "Has entrado en la sala");

        }else {
            return socket.emit("err", "La clave " + room + " es incorrecta.");

        }

    });

    socket.on("new-room", (data) => {
        while(true) {
            const randomNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            if (!gameRooms.includes(randomNumber)) {
                break;
            }
        }
        rooms.push(randomNumber);
        socket.join(randomNumber);
        console.log(socket.id + " ha creado con exito la sala con key " + randomNumber);
        socket.emit("success", "Has creado la sala");
    });

    })
});
 
