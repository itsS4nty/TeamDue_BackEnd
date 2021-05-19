const jwt = require('jsonwebtoken');

function validateToken(token, llave) {
    var boolValidate;
    if (token) {
        jwt.verify(token, llave, (err, decoded) => {
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