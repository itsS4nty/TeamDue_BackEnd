const jwt = require('jsonwebtoken');

function validate(token, llave) {
    if (token) {
        jwt.verify(token, llave, (err, decoded) => {
            if (err) {
                return false;

            }else {
                console.log("HOLAAAAAAAA");
                return token;
                // return true;
            }
        })

    }else {
        return false;
    }
}

module.exports = {
    validate: validate

}