var mongoose = require('mongoose');

var Models = require('../Models');
Block = mongoose.model('block');

var Utils = require('../Utils');

module.exports.register = function (req, res, next) {
    try {
        Block.create({
            user: req.body.user,
            blockedBy: req.user._id
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
