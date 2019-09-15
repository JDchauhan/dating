'use strict';
var jwt = require('jsonwebtoken');
var Config = require('../Config');
var Utils = require('../Utils');

module.exports.verify = (userType, req, res, next) => {
    console.log(userType)

    var token = req.headers.authorization || req.params.token;
    token = token.split(" ")[1]
    console.log(token)
    if (!token) {
        let errors = {
            auth: false
        };
        let error = new Error()
        error.code = 403
        next(error)
    }

    jwt.verify(token, Config.App.JWT_SECRET, function (err, decoded) {    
        if (err) {
            let error = new Error()
            error.code = 401
            next(error)
        } else if (!decoded._id || decoded._id.length !== 24) {
            let error = new Error()
            error.code = 401
            next(error)
        } else if (userType.find((value) => {
            return value === decoded.userType
        }) === undefined){
            let error = new Error()
            error.code = 403
            next(error)    
        }
    
        User.findById(decoded._id, {
            password: 0
        }, // projection
        function (err, user) {

            if (err) {
                let error = new Error()
                error.code = 500
                next(error)    
            }

            if (!user) {
                let error = new Error()
                error.code = 401
                next(error)
            } else if(user.tokenRefreshTime !== decoded.tokenRefreshTime){
                let error = new Error()
                error.code = 401
                next(error)    
            }

            req.user = user
            req.user.userType = decoded.userType
            if(parseInt((decoded.exp - (new Date() / 1000)) / 3600) > 1){
                req.user.token = token
            }

            next();
        });
    });
}

module.exports.refresh = (req, res, next) => {
    if (!req.user.token) {
        var token = jwt.sign({
            _id: req.user._id,
            tokenRefreshTime: req.user.tokenRefreshTime,
            userType: req.user.userType,
        }, Config.App.JWT_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            })

        req.user.token = token;
        console.log("Refresh".red)
    }
    next()
}

module.exports.generate = (id, userType, tokenRefreshTime) => {
    var token = jwt.sign({
        _id: id,
        tokenRefreshTime: tokenRefreshTime,
        userType: userType,
    }, Config.App.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        })

    console.log(token)
    return token

}