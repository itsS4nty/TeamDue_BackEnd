const express = require("express");
const router = express.Router();
const conexion = require("../database.js");

router.get('/usuarios', (req, res) => {
    console.log("Entrando por GET /");
    conexion.query("SELECT * FROM Usuarios", (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            res.send(400, err.message);
        
        }
    });
});

router.get('/:id', (req, res) => {
    console.log("Entrando por GET /id");
    const { id } = req.params;
    conexion.query("SELECT * FROM Usuarios WHERE id = ?", [id], (err, rows, fields)=> {
        if (!err) {
            res.json(rows[0]);

        }else {
            res.send(400, err.message);
        
        }
    });
})

router.get('/files/:id', (req, res) => {
    console.log("Entrando por GET /files/id");
    const { id } = req.params;
    conexion.query("SELECT * FROM Archivos WHERE usuario_id = ?", [id], (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            res.send(400, err.message);
        
        }
    });
});

router.post('/login', (req, res) => {
    console.log("Entrando por POST /login");
    const { usuario, password } = req.body;
    console.log(usuario, "y", password);
    conexion.query("SELECT * FROM Usuarios WHERE usuario = ? AND password = ? OR correo = ? AND password = ?", [usuario, password, usuario, password], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);

        }else {
            res.send(400, err.message);

        }
    });
});

router.post('/register', (req, res) => {
    console.log("Entrando por POST /register");
    const { nombre, apellidos, correo, usuario, password } = req.body;
    conexion.query("SELECT * FROM Usuarios WHERE usuario = ? OR correo = ?", [usuario, correo], (err, rows, fields) => {
        if (!err) {
            if (rows < 1) {
                conexion.query("INSERT INTO Usuarios (nombre, apellidos, correo, usuario, password, premium, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre, apellidos, correo, usuario, password, 0, now()], (err, rows, fields) => {
                    if (!err) {
                        res.send(201, "Created");

                    }else {
                        res.send(400, err.message);
                    
                    }
                });

            }else {
                res.send(409, "Duplicate");
            }

        }else {
            res.send(400, err.message);

        }
    });
});

module.exports = router;