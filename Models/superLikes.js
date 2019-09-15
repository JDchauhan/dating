'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuperLikesSchema = new Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
});

SuperLikesSchema.index( { "user": 1, "likedBy": 1 }, { unique: true } )

SuperLikesSchema.post('save', async (doc) => {
    process.emit('Notify_like', {
        to: doc.user,
        by: doc.likedBy,
        flag: "SUPERLIKE",
    });

})

module.exports = mongoose.model('superLikes', SuperLikesSchema, 'superLikes');