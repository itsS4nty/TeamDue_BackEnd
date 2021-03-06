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
                createLog("Obteniendo archivos del servidor en formato JSON", id);
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

router.get("/pedirTexto", (req, res) => {
    console.log("Entrando por GET /pedirTexto/?:usuario&:nombre");
    const usuario = req.query.usuario;
    const nombre = req.query.nombre;
    fs.readFile('/home/teamdue/files/' + usuario + "/" + nombre + ".txt", 'utf-8', (err, dataFichero) => {
        if(err) {
            console.log('error: ', err);
            res.status(400).send("Bad Request");

        } else {
            // res.send(JSON.parse(dataFichero.replace(/\n/g,"")));
            let data = [{type: "paragraph",   children: [{ text: "Des del servidor"}]}];
            //data.push(dataFichero);
            dataFichero = dataFichero.replace(/(')/g, '"');
            dataFichero = dataFichero.replace(/\n/g,"");
            dataFichero = dataFichero.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":');
            // console.log(dataFichero);
            // console.log(JSON.parse(JSON.stringify(dataFichero)));
            // console.log();
            res.send(JSON.parse(dataFichero));
            // res.send(dataFichero);
        }
      });

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
                            createLog("Obteniendo archivo del servidor", findedUsuario.id);
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
                            createLog("Descargando archivo del servidor", findedUsuario.id);
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
                        createLog("Inicio de sesion", findedArchivo["id"]);
                        res.json({
                            mensaje: "Autenticacion correcta",
                            token: token,
                            usuario: findedArchivo
                        })

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

                    createLog("Creacion de usuario", usu["id"]);
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

router.post('/newFile', (req, res) => {
    console.log("Entrando por POST /newFile");
    const { UsuarioId:UsuarioIdInp, nameFile, tipo } = req.body;
    const { token } = req.headers;
    console.log(UsuarioIdInp, nameFile, tipo);

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: { [Op.and]: [{UsuarioId:UsuarioIdInp}, {nombre:nameFile}, {tipo: tipo}] }}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    db.Usuarios.findOne({where: {id: UsuarioIdInp}}).then((findedUsuario) => {
                        if (findedUsuario === null) {
                            res.status(409).send("User not exists");
        
                        }else {
                            if (tipo === "png") {
                                fs.copyFile("/home/teamdue/files/blank.png", "/home/teamdue/files/" + findedUsuario.usuario + "/" +  nameFile  + ".png", (err) => {
                                    if (err) {
                                        console.log(err.message);
                                    }
                                    
                                });                    

                            }else if (tipo === "txt") {
                                fs.copyFile("/home/teamdue/files/blank.txt", "/home/teamdue/files/" + findedUsuario.usuario + "/" +  nameFile  + ".txt", (err) => {
                                    if (err) {
                                        console.log(err.message);
                                    }
                                    
                                }); 
                            }

                            var archivoCreado = db.Archivos.create({
                                nombre: nameFile,
                                tipo: tipo,
                                UsuarioId: UsuarioIdInp
                            });

                            createLog("Creacion de fichero", findedUsuario.id);
                            res.status(201).send(archivoCreado.id);  
                        }
                    });
        
                }else {
                    res.status(409).send("Duplicate");
                }
        
            }).catch((err) => {
                res.status(400).send(err.message);
                console.log(err.message);
        
            });

        }else {
            res.status(403).send("Token no valido");

        }
    })

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
        
                            var archivoCreado = db.Archivos.create({
                                nombre: nameArray[0],
                                tipo: nameArray[1],
                                UsuarioId: UsuarioIdInp
                            });
                            createLog("Creacion de fichero", findedUsuario.id);
                            res.status(201).send(archivoCreado.id);  
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

router.post('/saveFile', (req, res) => {
    console.log("Entrando por POST /saveFile");
    const { idArchivo, base64Data } = req.body;
    console.log(req)
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
                            fs.writeFile("/home/teamdue/files/" + findedUsuario.usuario + "/" + findedArchivo.nombre + "." + findedArchivo.tipo, base64Data, 'base64', function(err) {
                                console.log(err);
                            });
                            createLog("Guardando cambios en el archivo alojado en el servidor", findedUsuario.id);
                            res.send("Archivo guardado");
                            // fs.renameSync(req.file.path, fileName.join("/"));
                            // findedArchivo.tipo = req.file.mimetype.split("/")[1];
                            // findedArchivo.save();
        
                        }
                    });
                }
        
            }).catch((err) => {
                //fs.unlinkSync(req.file.path);
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
                                createLog("Usuario validado", element.id);
                                createLog("Directorio en el servidor creado", element.id);
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

router.get('/comprovarArchivo', (req, res) => {
    console.log("Entrando por GET /comprovarArchivo/?:nomFichero&:idUsuario&:tipo");
    const nomFichero = req.query.nomFichero;
    const idUsuario = req.query.idUsuario;
    const tipo = req.query.tipo;
    const { token } = req.headers;

    validateToken(token, app.get("llave")).then(respuestaToken => {
        if (respuestaToken) {
            db.Archivos.findOne({where: { [Op.and]: [{UsuarioId:idUsuario}, {nombre:nomFichero}, {tipo: tipo}] }}).then((findedArchivo) => {
                if (findedArchivo === null) {
                    res.status(200).send(true);
                    
                }else {
                    res.status(200).send({id: findedArchivo.dataValues.id});
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

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);

}

async function hashPasswordIsSame(passwordHash, password2) { 
    return await bcrypt.compare(password2, passwordHash);

}

async function createLog(accion, idUsu) {
    db.Logs.create({
        accion: accion,
        fecha: new Date(),
        UsuarioId: idUsu
    });
}

module.exports = router;