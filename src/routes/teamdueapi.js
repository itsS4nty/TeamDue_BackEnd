const express = require("express");
const router = express.Router();
const conexion = require("../database.js");
const bcrypt = require('bcrypt')

router.get('/usuarios', (req, res) => {
    console.log("Entrando por GET /");
    conexion.query("SELECT * FROM Usuarios", (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            res.status(400).send(err.message);
        
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
            res.status(400).send(err.message);
        
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
            res.status(400).send(err.message);
        
        }
    });
});

router.post('/login', (req, res) => {
    console.log("Entrando por POST /login");
    const { usuario, password } = req.body;
    console.log(usuario, "y", password);
    conexion.query("SELECT * FROM Usuarios WHERE usuario = ? OR correo = ? LIMIT 1", [usuario, usuario], (err, rows, fields) => {
        if (!err) {
            console.log(rows[0]);
            if (rows > 0) {
                console.log("entra");
                const pass = rows[0]["password"];
                hashPasswordIsSame(pass, password).then(isSame => {
                    if (isSame) {
                        res.json(rows[0]);
    
                    }else {
                        res.status(409).send("Incorrect password");
                    }
                });

            }else {
                res.status(404).send("No encontrado");
            }

        }else {
            res.status(400).send(err.message);
        }
    });
});

router.post('/register', (req, res) => {
    console.log("Entrando por POST /register");
    const { nombre, apellidos, correo, usuario, password } = req.body;
    conexion.query("SELECT * FROM Usuarios WHERE usuario = ? OR correo = ?", [usuario, correo], (err, rows, fields) => {
        if (!err) {
            if (rows < 1) {
                hashPassword(password).then(passEncrypt => {         
                    conexion.query("INSERT INTO Usuarios (nombre, apellidos, correo, usuario, password, premium, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre, apellidos, correo, usuario, passEncrypt, 0, new Date()], (err, rows, fields) => {
                        if (!err) {
                            res.status(201).send("Created");
    
                        }else {
                            res.status(400).send(err.message);
                    
                        }
                    });
                });

            }else {
                res.status(409).send("Duplicate");
            }

        }else {
            res.status(400).send(err.message);
        }
    });
});

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);

}

async function hashPasswordIsSame(passwordHash, password2) { 
    return await bcrypt.compare(password2, passwordHash);

}

module.exports = router;