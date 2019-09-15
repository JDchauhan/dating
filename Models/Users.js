'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokenRefreshTime: {
    type: Number,
    required: false,
    default: 1,
  },
  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('user', UserSchema, 'users');