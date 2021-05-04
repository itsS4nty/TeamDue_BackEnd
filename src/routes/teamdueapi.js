const express = require("express");
const router = express.Router();
const conexion = require("../database.js");

router.get('/usuarios', (req, res) => {
    console.log("Entrando por GET /");
    conexion.query("SELECT * FROM Usuarios", (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            console.log(err);
        
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
            console.log(err);
        
        }
    });
})

router.post('/login', (req, res) => {
    console.log("Entrando por POST /login");
    const { user, password } = req.body;
    console.log(user, "y", password);
    conexion.query("SELECT * FROM Usuarios WHERE usuario = ? AND password = ? OR correo = ? AND password = ?", [user, password, user, password], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);

        }else {
            console.log(err);

        }
    });
});

router.get('/files/:id', (req, res) => {
    console.log("Entrando por GET /files/id");
    const { id } = req.params;
    conexion.query("SELECT * FROM Archivos WHERE usuario_id = ?", [id], (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            console.log(err);
        
        }
    });
});

module.exports = router;