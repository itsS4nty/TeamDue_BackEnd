const express = require("express");
const jwt = require('jsonwebtoken');
const config = require('../jwt/conf.js');
const router = express.Router();
const bcrypt = require('bcrypt');
const cors = require('cors');
const sequelize = require("../database.js");
const db = require('../.././models');
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { sendEmail } = require("../mail/confEmail");
const multer = require("multer");
const upload = multer({ dest: "/home/teamdue/tmp" });
const app = express();
const { validateToken } = require("../jwt/validate.js");

app.set("llave", config.keyMaster);
router.use(cors());

router.get('/files/:id', (req, res) => {
    console.log("Entrando por GET /files/:id");
    const { id } = req.params;
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findAll({where: { UsuarioId: id }}).then((findedArchivo) => {
                res.json(findedArchivo);
                
            }).catch((err) => {
                res.status(400).send(err.message);
                console.log(err.message);
        
            });
        }else {
            res.status(403).send("Token no valido");

        }
    })
});

router.get('/file/:id', (req, res) => {
    console.log("Entrando por GET /file/:id");
    const { id:idArchivo } = req.params;
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: {id:idArchivo}}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    res.status(409).send("File not exists");
        
                }else {
                    db.Usuarios.findOne({where: {id: findedArchivo.UsuarioId}}).then((findedUsuario) => {
                        if (findedUsuario === null) {
                            res.status(409).send("User not exists");
        
                        }else {
                            var dir = "/home/teamdue/files/" + findedUsuario.usuario + "/" + findedArchivo.nombre + "." + findedArchivo.tipo;
                            res.sendFile(dir);
        
                        }
                    });
                }
        
            }).catch((err) => {
                res.status(400).send(err.message);
                console.log(err.message);
            });

        }else {
            res.status(403).send("Token no valido");
        }
    });
});

router.get('/downloadFile/:id', (req, res) => {
    console.log("Entrando por GET /downloadFile/:id");
    const { id:idArchivo } = req.params;
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: {id:idArchivo}}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    res.status(409).send("File not exists");
        
                }else {
                    db.Usuarios.findOne({where: {id: findedArchivo.UsuarioId}}).then((findedUsuario) => {
                        if (findedUsuario === null) {
                            res.status(409).send("User not exists");
        
                        }else {
                            var dir = "/home/teamdue/files/" + findedUsuario.usuario + "/" + findedArchivo.nombre + "." + findedArchivo.tipo;
                            res.download(dir);
        
                        }
                    });
                }
        
            }).catch((err) => {
                res.status(400).send(err.message);
                console.log(err.message);
            });

        }else {
            res.status(403).send("Token no valido");
        }
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
                    if (findedArchivo["validado"] == 1) {
                        const payload = {
                            check: true
                        };
                        const token = jwt.sign(payload, app.get("llave"), {
                            expiresIn: 3600
                        });
                        res.json({
                            mensaje: "Autenticacion correcta",
                            token: token,
                            usuario: findedArchivo
                        })
                        // res.json(findedArchivo);

                    }else {
                        res.status(403).send("Usuario no validado");

                    }

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
    const { nombre:nombreInp, apellido1:apellido1Inp, apellido2:apellido2Inp, correo:correoInp, usuario:usuarioInp, password } = req.body;
    db.Usuarios.findOne({where: { [Op.or]: [{usuario: usuarioInp}, {correo: correoInp}]}}).then((findedArchivo) => {
        if (findedArchivo === null) {
            hashPassword(password).then(passEncrypt => {         
                db.Usuarios.create({
                    nombre: nombreInp,
                    apellido1: apellido1Inp,
                    apellido2: apellido2Inp,
                    correo: correoInp,
                    usuario: usuarioInp,
                    password: passEncrypt,
                    premium: 0,
                    validado: 0,
                    fecha_registro: new Date()
        
                }).then(usu => {
                    db.ConfiguracionUsuario.create({
                        tema_oscuro: 0,
                        mandar_correo: 1,
                        UsuarioId: usu["id"]
    
                    });
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

router.post('/createFile', upload.single("file"), (req, res) => {
    console.log("Entrando por POST /createFile");
    const { UsuarioId:UsuarioIdInp } = req.body;
    const nameArray =  req.file.originalname.split(".");
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: { [Op.and]: [{UsuarioId:UsuarioIdInp}, {nombre:nameArray[0]}, {tipo: nameArray[1]}] }}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    db.Usuarios.findOne({where: {id: UsuarioIdInp}}).then((findedUsuario) => {
                        if (findedUsuario === null) {
                            fs.unlinkSync(req.file.path);
                            res.status(409).send("User not exists");
        
                        }else {
                            var fileName = req.file.path.split("/");
                            fileName[3] = "files";
                            fileName[fileName.length - 1] = findedUsuario.usuario;
                            fileName[fileName.length] = req.file.originalname;
                            fs.renameSync(req.file.path, fileName.join("/"));
        
                            db.Archivos.create({
                                nombre: nameArray[0],
                                tipo: nameArray[1],
                                UsuarioId: UsuarioIdInp
                            });
                
                            res.status(201).send("Created");  
                        }
                    });
        
                }else {
                    fs.unlinkSync(req.file.path);
                    res.status(409).send("Duplicate");
                }
        
            }).catch((err) => {
                fs.unlinkSync(req.file.path);
                res.status(400).send(err.message);
                console.log(err.message);
        
            });

        }else {
            fs.unlinkSync(req.file.path);
            res.status(403).send("Token no valido");
        }
    });
});

router.post('/saveFile', upload.single("file"), (req, res) => {
    console.log("Entrando por POST /saveFile");
    const { idArchivo } = req.body;
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: {id:idArchivo}}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    fs.unlinkSync(req.file.path);
                    res.status(409).send("File not exists");
        
                }else {
                    db.Usuarios.findOne({where: {id: findedArchivo.UsuarioId}}).then((findedUsuario) => {
                        if (findedUsuario === null) {
                            fs.unlinkSync(req.file.path);
                            res.status(409).send("User not exists");
        
                        }else {
                            var fileName = req.file.path.split("/");
                            fileName[3] = "files";
                            fileName[fileName.length - 1] = findedUsuario.usuario;
                            fileName[fileName.length] = findedArchivo.nombre + "." + req.file.mimetype.split("/")[1];
                            fs.unlinkSync("/home/teamdue/files/" + findedUsuario.usuario + "/" + findedArchivo.nombre + "." + findedArchivo.tipo);
                            fs.renameSync(req.file.path, fileName.join("/"));
                            findedArchivo.tipo = req.file.mimetype.split("/")[1];
                            findedArchivo.save();
                            res.send("Archivo guardado");
        
                        }
                    });
                }
        
            }).catch((err) => {
                fs.unlinkSync(req.file.path);
                res.status(400).send(err.message);
                console.log(err.message);
            });

        }else {
            fs.unlinkSync(req.file.path);
            res.status(403).send("Token no valido");
        }
    });
});

router.get('/verify/:hashString', (req, res) => {
    console.log("Entrando por GET /verify/:hashString");
    const { hashString } = req.params;
    const passwordDecode = decodeURIComponent(hashString);

    db.Usuarios.findAll({where: { validado: 0 }}).then((usuarios) => { 
        const respuesta = async() => {
            for (let element of usuarios) {
                let igual = await hashPasswordIsSame(passwordDecode, element.usuario);
                if (igual) {
                    element.validado = 1;
                    element.save();

                    if (fs.existsSync(path.join("/home/teamdue/files",  element.usuario))) {
                        console.log("El directorio del usuario " + element.usuario + " ya existe");

                    }else {
                        fs.mkdir(path.join("/home/teamdue/files",  element.usuario), { recursive: true }, (error) => {
                            if (error) {
                                console.log(error.message);
    
                            }else{
                                console.log("Directorio del usuario creado con exito");
                            }
                        })

                    }
                    return true;
                }
            }
            return false;
        }

        respuesta().then(resp => {      
            if (resp) {
                res.status(201).send("Usuario validado");
    
            }else {
                res.status(409).send("Verificacion no valida");
    
            }
        })

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