const jwt = require('jsonwebtoken');

async function validateToken(token, llave) {
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

    return true;
    // return boolValidate;
}

module.exports = {
    validateToken: validateToken

}