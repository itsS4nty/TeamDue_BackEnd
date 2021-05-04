const express = require("express");
const router = express.Router();
const conexion = require("../database.js");

router.get('/', (req, res) => {
    conexion.query("SELECT * FROM Usuarios", (err, rows, fields)=> {
        if (!err) {
            res.json(rows);

        }else {
            console.log(err);
        
        }
    });
});

module.exports = router;