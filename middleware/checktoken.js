'use strict';

const Response = require('../config/response');
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const AuthMiddleware = {
    checkToken : (req, res, next) => {
        console.log(req.headers);
        var token = req.headers.authorization;
        if(token == null){
            Response.send(res, 403, "You are not authorized");
        } else {
            jwt.verify(token, secret.secretkey, (err, decrypt) => {
                if(decrypt != undefined){
                    req.userdata = decrypt;
                    global.user = decrypt;
                    next();
                } else {
                    Response.send(res, 403, "You are not authorized");
                }
            });
        }
    },
    checkTokenAndRoleAdmin : (req, res, next) => {
        console.log(req.headers);
        var token = req.headers.authorization;
        if(token == null){
            Response.send(res, 403, "You are not authorized");
        } else {
            jwt.verify(token, secret.secretkey, (err, decrypt) => {
                if(decrypt != undefined){
                    if(decrypt.rolename == 'admin'){
                        req.userdata = decrypt;
                        global.user = decrypt;
                        next();
                    } else {
                        Response.send(res, 403, "You are not authorized because your role not Admin");
                    }
                } else {
                    Response.send(res, 403, "You are not authorized");
                }
            });
        }
    }
};

module.exports = AuthMiddleware;