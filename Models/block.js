'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Block = new Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    blockedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
});

Block.index( { "user": 1, "blockedBy": 1 }, { unique: true } )
module.exports = mongoose.model('block', Block, 'block');