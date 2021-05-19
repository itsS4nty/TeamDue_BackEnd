const jwt = require('jsonwebtoken');

function validateToken(token, llave) {
    if (token) {
        jwt.verify(token, llave, (err, decoded) => {
            if (err) {
                return false;

            }else {
                console.log("ho");
                return true;

            }
        })

    }else {
        return false;
    }
}

module.exports = {
    validateToken: validateToken

}