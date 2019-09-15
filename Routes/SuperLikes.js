'use strict';

const Joi = require('joi');
const Validator = require('express-joi-validation').createValidator({
    // You can pass a specific Joi instance using this option. By default the
    // module will load the @hapi/joi version you have in your package.json
    // joi: require('@hapi/joi')
    passError: true
});

var Controllers = require('../Controllers');    
var Utils = require('../Utils');

module.exports = function (app) {

    app.post("/superLikes" , (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify, Validator.body(Joi.object({
        user: Joi.string().required(),
    })), Controllers.SuperLikes.register);

};