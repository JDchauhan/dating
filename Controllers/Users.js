var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var fs = require('fs');
var formidable = require('formidable');

var Models = require('../Models');
User = mongoose.model('user');

var Utils = require('../Utils');

module.exports.register = function (req, res, next) {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        User.create(req.body,
            function (err, user) {
                if (err) {
                    return next(err);
                }

                return Utils.Responses.successMsg(req, res, null);
            });

    } catch (err) {
        return next(err);
    }
}

module.exports.login = function (req, res, next) {
    try {
        User.findOne({ email: req.body.email },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    let error = new Error()
                    error.code = 404
                    console.log("hi")
                    return next(error)
                }

                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

                if (!passwordIsValid) {
                    let error = new Error()
                    error.code = 401
                    return next(error)
                } else {
                    let token = Utils.Auth.generate(user._id, "user", user.tokenRefreshTime)

                    let results = {
                        token: token,
                    };
                    return Utils.Responses.successMsg(req, res, results);
                }

            });

    } catch (err) {
        return next(err);
    }
}

module.exports.list = function (req, res, next) {
    try {
        User.find({
            _id: {
                $ne: req.user._id
            },
            image: {
                $exists: true
            }
        },{
            password: 0,
        }, function (err, user) {
                if (err) {
                    return next(err);
                }

                return Utils.Responses.successMsg(req, res, user);

            });

    } catch (err) {
        return next(err);
    }
}


module.exports.imageUpload = function (req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.images.path;
            var newpath = './public/images/' + new Date().getTime() + parseInt(Math.random() * 10000) + files.images.name;
            newpath = newpath.split(' ').join('+');
            
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                User.update({
                    _id: req.user._id
                }, {
                        image: newpath
                    },
                    function (err, user) {
                        if (err) {
                            return next(err);
                        }

                        return Utils.Responses.successMsg(req, res, null);
                    });
            })
        })

    } catch (err) {
        return next(err);
    }
}


module.exports.imageServe = function (req, res, next) {
    try {
        User.findOne({
            _id: req.params.userId
        }, function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                let error = new Error()
                error.code = 404
                return next(error)
            }

            console.log(user)
            if(user.image){
                try{
                    let fd = fs.createReadStream(user.image);
                    fd.pipe(res);            
                }catch(err){
                    
                }
            }
            
        });

        
    } catch (err) {
        return next(err);
    }
}
