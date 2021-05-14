const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const cors = require('cors');
const sequelize = require("../database.js");
const db = require('../.././models');
const { Op } = require("sequelize");

const { sendEmail } = require("../mail/confEmail")

router.use(cors());

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
    db.Usuarios.findOne({where: { [Op.or]: [{usuario: usuarioInp}, {correo: correoInp}]}}).then((findedArchivo) => {
        if (findedArchivo === null) {
            hashPassword(password).then(passEncrypt => {         
                var usu = db.Usuarios.create({
                    nombre: nombreInp,
                    apellidos: apellidosInp,
                    correo: correoInp,
                    usuario: usuarioInp,
                    password: passEncrypt,
                    premium: 0,
                    validado: 0,
                    fecha_registro: new Date()
        
                });

                db.ConfiguracionUsuario.create({
                    id: usu["id"],
                    tema_oscuro: 0,
                    mandar_correo: 1

                });
                
                hashPassword(usuarioInp).then(usserHash => {
                    sendEmail(correoInp, encodeURIComponent(usserHash));

                });
        
                res.status(201).send("Created");  
            });

        }else {
            res.status(409).send("Duplicate");

        }
    }).catch((err) => {
        res.status(400).send(err.message);
        console.log(err.message);

    });
});

router.post('/createFile', (req, res) => {
    console.log("Entrando por POST /createFile");
    const { nombre:nombreInp, tipo:tipoInp, UsuarioId:UsuarioIdInp } = req.body;
    db.Archivos.findOne({where: { [Op.and]: [{UsuarioId:UsuarioIdInp}, {nombre:nombreInp}, {tipo:tipoInp}] }}).then((findedArchivo) => {
        if (findedArchivo === null) {
            db.Usuarios.findOne({where: {id: UsuarioIdInp}}).then((findedUsuario) => {
                if (findedUsuario === null) {
                    res.status(409).send("User not exists");

                }else {
                    db.Archivos.create({
                        nombre: nombreInp,
                        tipo: tipoInp,
                        UsuarioId: UsuarioIdInp
                    });
        
                    res.status(201).send("Created");  
                }
            });

        }else {
            res.status(409).send("Duplicate");

        }
        
    }).catch((err) => {
        res.status(400).send(err.message);
        console.log(err.message);

    });

});

router.get('/verify/:hashString', (req, res) => {
    console.log("Entrando por GET /verify/:hashString");
    const { hashString } = req.params;
    const passwordDecode = decodeURIComponent(hashString);
    let usuarioElegido;

    db.Usuarios.findAll({where: { validado: 0 }}).then((usuarios) => { 
        // for (let element of usuarios) {
        //     hashPasswordIsSame(passwordDecode, element.usuario).then(isSame => {
        //         if (isSame) {
        //             element.validado = 1;
        //             element.save();
        //             validado = isSame;
        //             res.status(201).send("Ok usuario validado")
        //         }
        //     });
        // };


        usuarios.forEach(async element => {
            await hashPasswordIsSame(passwordDecode, element.usuario).then(isSame => {
                if (isSame) {
                    console.log("entrando");
                    usuarioElegido = element;
                }
            });
        });
        console.log(usuarioElegido);

        if (!usuarioElegido === undefined) {
            usuarioElegido.validado = 1;
            usuarioElegido.save();
            res.status(201).send("Ok usuario validado")

        }else {
            res.status(409).send("Verificacion no valida");

        }

    }).catch((err) => {
        res.status(400).send(err.message);
        console.log(err.message);

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