const express = require("express");
const router = express.Router();
const conexion = require("../database.js");
const bcrypt = require('bcrypt');
const cors = require('cors');
const sequelize = require("../db.js");
const db = require('../.././models');
const { Op } = require("sequelize");
// const logsDB = require('../../models/logs');
// const userDB = require('../../models/usuarios');
// const configuracionDB = require('../../models/configuracionusuario');

router.use(cors());

sequelize.sync({ force:false }).then(() => {
    console.log("Conexion a la base de datos establecida con exito")

}).catch(error => {
    console.log("No se ha podido establecer conexion con la base de datos", error);

})

router.get('/files/:id', (req, res) => {
    console.log("Entrando por GET /files/id");
    const { id } = req.params;
    db.Archivos.findAll({where: { UsuarioId: id }}).then((findedArchivo) => {
        res.json(findedArchivo);
        
    }).catch((err) => {
        res.status(400).send(err.message);
        console.log(err.message);

    });
});

router.post('/login', (req, res) => {
    console.log("Entrando por POST /login");
    const { usuario, password } = req.body;
    db.Usuarios.findOne({where: { [Op.or]: [{usuario: usuario}, {correo: usuario}]}}).then((findedArchivo) => {
        if (findedArchivo === null) {
            res.status(404).send("No encontrado");

        }else {
            hashPasswordIsSame(findedArchivo["password"], password).then(isSame => {
                if (isSame) {
                    res.json(findedArchivo);

                }else {
                    res.status(409).send("Incorrect password");
                    
                }
            });
        }

    }).catch((err) => {
        res.status(400).send(err.message);
        console.log(err.message);

    });
});

router.post('/register', (req, res) => {
    console.log("Entrando por POST /register");
    const { nombre:nombreInp, apellidos:apellidosInp, correo:correoInp, usuario:usuarioInp, password } = req.body;
    hashPassword(password).then(passEncrypt => {         
        db.Usuarios.create({
            nombre: nombreInp,
            apellidos: apellidosInp,
            correo: correoInp,
            usuario: usuarioInp,
            password: passEncrypt,
            premium: 0,
            fecha_registro: new Date(),

        }).then(res.status(201).send("Created")).catch((err) => {
            console.log(err.message);
            res.status(409).send("Duplicate");

        });
        // res.status(201).send("Created")
        
    });
});

// router.post('/register', (req, res) => {
//     console.log("Entrando por POST /register");
//     const { nombre, apellidos, correo, usuario, password } = req.body;
//     conexion.query("SELECT * FROM Usuarios WHERE usuario = ? OR correo = ?", [usuario, correo], (err, rows, fields) => {
//         if (!err) {
//             if (rows < 1) {
                // hashPassword(password).then(passEncrypt => {         
                //     conexion.query("INSERT INTO Usuarios (nombre, apellidos, correo, usuario, password, premium, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre, apellidos, correo, usuario, passEncrypt, 0, new Date()], (err, rows, fields) => {
                //         if (!err) {
                //             res.status(201).send("Created");
    
                //         }else {
                //             res.status(400).send(err.message);
                    
                //         }
                //     });
                // });

//             }else {
//                 res.status(409).send("Duplicate");
//             }

//         }else {
//             res.status(400).send(err.message);
//         }
//     });
// });

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);

}

async function hashPasswordIsSame(passwordHash, password2) { 
    return await bcrypt.compare(password2, passwordHash);

}

module.exports = router;