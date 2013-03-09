var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = require('./db')
  , supergoose = require('supergoose')
  , _ = require('underscore');

// ------------------------------------------------------------------------
// User Model

var UserSchema = new Schema({
  username:   { type: String,   index: true }
  , password: { type: String,   default: null }
  , email:    { type: String,   default: null }
  , joined:   { type: Date,     default: new Date() }
  , roles:    { type: [String], default: ['user'] }
});
UserSchema.plugin(supergoose);
UserSchema.virtual('id')
.get(function () {
  return this._id;
});

UserSchema.methods.validPassword = function(str) {
  if (this.password === str) {
    return true;
  } else {
    return false;
  }
}

UserSchema.statics.createUser = function(username, password, cb) {
  
  var user = new this();
  this.findOne({username: username}, function(err, exists) {
    if (exists === null) {
      user.username = username;
      user.password = password;

      user.save( function(err, user) {
        if (err) {
          cb(err, false, {error: "Error while creating user!"} );
        } else {
          cb(null, user, {success: "Welcome to smsPREP!"} );
        }
      });
    } else {
      cb(null, false, { error: 'The username ' + username + ' is already taken!' });
    }
  });

}

module.exports = db.model('User', UserSchema);