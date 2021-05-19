const jwt = require('jsonwebtoken');

function validate(token, llave) {
    console.log(token);
    console.log(llave);
    if (token) {
        jwt.verify(token, llave, (err, decoded) => {
            if (err) {
                return false;

            }else {
                return true;
            }
        })

    }else {
        return false;
    }
}

module.exports = {
    validate: validate

}