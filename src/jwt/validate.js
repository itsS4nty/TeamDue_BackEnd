const jwt = require('jsonwebtoken');

function validate(token, app) {
    if (token) {
        jwt.verify(token, app.get("llave"), (err, decoded) => {
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