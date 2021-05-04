// Imports
const connImport = require('./conexion.js');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors:{origin: "*",}});
const {Server} = require("socket.io"), server = new Server(8000);


// Variables
var conexion = connImport.crearConexion();


// Funciones
io.on("connection", (socket) => {
    console.log("Nueva conexion: " + socket.id);

    socket.on("login", (data) => {
        // var login = connImport.consultaLogin(conexion, data.user, data.password);

        // if (login) {
        //     console.log("Acertado");
        // }

        conexion.query("SELECT * FROM Usuarios WHERE usuario LIKE '" + user + "' AND password LIKE '" + password + "'", function (err, result, fields) {
            if (err) {
                console.error('Error de consulta: ' + err.stack);
                return;
            }

            console.log(result);
            return true;
        });

    })
});
  
httpServer.listen(8080);