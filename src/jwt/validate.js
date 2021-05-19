const jwt = require('jsonwebtoken');

function validateToken(token) {
    var boolValidate;
    if (token) {
        jwt.verify(token, app.get("llave"), (err, decoded) => {
            if (err) {
                boolValidate = false;

            }else {
                boolValidate = true

            }
        })

    }else {
        boolValidate = false
    }

    return boolValidate;
}

module.exports = {
    validateToken: validateToken

}