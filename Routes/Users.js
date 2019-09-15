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

    // user Routes
    // app.get("/" , (req, res, next) => {next(["admin", "user"], ...arguments)}, Utils.Auth.verify, function (req, res) {
    //     return Utils.Responses.successMsg(req, res, {message: "you have successfully reached the api"});
    // });

    app.get('/', function(req, res){
        res.render('login')
    })

    app.get('/dashboard', function(req, res){
        res.render('dashboard')
    })

    app.get("/list", (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify, Controllers.Users.list);

    app.post("/register", Validator.body(Joi.object({
        email: Joi.string().email().min(3).max(256).required(),
        password: Joi.string().min(8).max(16).required(),
    })), Controllers.Users.register);

    app.post("/login", Validator.body(Joi.object({
        email: Joi.string().email().min(3).max(256).required(),
        password: Joi.string().min(8).max(16).required(),
    })), Controllers.Users.login);

    app.post("/image", (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify, Validator.headers(Joi.object({
        'content-type' : Joi.string().required(),
    })), Controllers.Users.imageUpload);

    app.get('/public/images/user/:userId', Controllers.Users.imageServe)

};