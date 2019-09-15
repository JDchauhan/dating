var mongoose = require('mongoose');

var Models = require('../Models');
Likes = mongoose.model('likes');

var Utils = require('../Utils');

module.exports.register = function (req, res, next) {
    try {
        Likes.create({
            user: req.body.user,
            likedBy: req.user._id
        },
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
