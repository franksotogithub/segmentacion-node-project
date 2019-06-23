let jwt = require('jsonwebtoken');
let config = require('../config');

let MiddlewareAuth = {
    checkToken(req, res, next){
        let token = req.headers['x-access-token'] || req.headers['authorization']|| req.headers['Authorization']; // Express headers are auto converted to lowercase
        if (token) {

            if (token.startsWith('JWT ')) {
                // Remove JWT from string
                token = token.slice(4, token.length);

                jwt.verify(token, config.jwt_token.secret_key, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({
                            success: false,
                            message: 'Token no es valido'
                        });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                });

            }
            else{
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }

}

module.exports = MiddlewareAuth;