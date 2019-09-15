'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikesSchema = new Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
});

LikesSchema.index( { "user": 1, "likedBy": 1 }, { unique: true } )

LikesSchema.post('save', async (doc) => {
    process.emit('Notify_like', {
        to: doc.user,
        by: doc.likedBy,
        flag: "LIKE",
    });

})

module.exports = mongoose.model('likes', LikesSchema, 'likes');