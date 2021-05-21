// Imports
const connImport = require('./database.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
const express = require('express');


// Variables
const app = express();
var gameRooms = [];
var clientes = [];

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
    clientes.push(socket.id);
    console.log("Nueva conexion:", socket.id);
    console.log("Clientes actualmente: " + clientes.length);

    socket.on("canvas-data", (data) => {
        // console.log(socket.id, "entrando por: canvas-data");
        let array = Array.from(socket.rooms);
        // console.log(array[1]);
        // io.to(array[1]).emit("canvas-data", data);
        io.to(array[array.length - 1]).emit("canvas-data", data);
        // socket.broadcast.emit("canvas-data", data);
    });

    socket.on("draw-line", (data) => {
        let array = Array.from(socket.rooms);
        // io.to(array[1]).emit("draw-line", data);
        io.to(array[array.length - 1]).emit("draw-line", data);
    })

    socket.on("draw-rect", (data) => {
        let array = Array.from(socket.rooms);
        // io.to(array[1]).emit("draw-rect", data);
        io.to(array[array.length - 1]).emit("draw-rect", data);
    })

    socket.on("background-image", (data) => {
        let array = Array.from(socket.rooms);
        // io.to(array[1]).emit("background-image", data);
        io.to(array[array.length - 1]).emit("background-image", data);
    })

    socket.on("filters", (data) => {
        let array = Array.from(socket.rooms);
        // io.to(array[1]).emit("filters", data);
        io.to(array[array.length - 1]).emit("filters", data);
    })

    socket.on("refresh-image", (data) => {
        let array = Array.from(socket.rooms);
        // io.to(array[1]).emit("refresh-image", data);
        io.to(array[array.length - 1]).emit("refresh-image", data);
    })

    socket.on("reconnect-client", (data) => {
        console.log(socket.id + " intentado reconectar: " + data);

    });

    socket.on("disconnect", function(){
        clientes.splice(clientes.indexOf(socket.id), 1);
        console.log(socket.id + " desconectado del servidor");

    });

    socket.on("peticionSala-enviada", (data) => {
        console.log(socket.id + " entrando por peticionSala-enviada");
        for (var i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomKey == data.room) {
                console.log(socket.id + " con nombre de usuario " + data.user + " ha enviado una peticion a la room con id " + data.room + " exitosamente.");
                dataSaliente = {
                    roomKey: gameRooms[i].roomKey,
                    administrator: gameRooms[i].administrator,
                    idPeticion: socket.id,
                    nombreUsuario: data.user
                };
                return io.to(gameRooms[i].administrator).emit("peticion-recibida", dataSaliente);
            }
        }

        return socket.emit("err", "La clave " + data.room + " es incorrecta.");
    });

    socket.on("aceptado-room", (data) =>  {
        console.log(socket.id + " entrando por aceptado-room para aceptar la entrada a " + data.idPeticion + " para la sala: " + data.roomKey);
        return io.to(data.idPeticion).emit("peticionAceptada", data.roomKey);
    });

    socket.on("rechazado-room", (data) => {
        console.log(socket.id + " entrando por rechazado-room para rechazar la entrada a " + data.idPeticion + " para la sala: " + data.roomKey);
        return io.to(data.idPeticion).emit("peticionRechazada", data.roomKey);
    });

    socket.on("join-room", (room) => {
        console.log(socket.id + " entrando por join-room");
        socket.join(room);
        console.log(socket.id + " se ha unido a la sala con key " + room + " exitosamente.");
        return socket.emit("entrando-sala", room);
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

    socket.on("mensaje", (data) => {
        console.log("Enviando mensaje a la sala: " + data.sala);
        socket.to(data.sala).emit("mensajeRecibido", data.mensaje);

    });

});

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
  
process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT');
});
 
