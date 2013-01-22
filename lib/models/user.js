var mongoose = require('mongoose')
    , db = require('./db')
    , supergoose = require('supergoose')
    , _ = require('underscore');

// User Schema -----------------------------------
var UserSchema = new mongoose.Schema({
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
    console.log("PASSWORD OK!");
    return true;
  } else {
    console.log("PASSWORD ERR!");
    return false;
  }
}

UserSchema.statics.createUser = function(username, password, cb) {
  
  var user = new this();
  console.log("Does the user " + username + " exist?");

  this.findOne({username: username}, function(err, exists) {
    if (exists === null) {

      console.log("It does not exist! Creating...");
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

      console.log("It exists! Aborting...");
      cb(null, false, { error: 'The username ' + username + ' is already taken!' });
    }
  });

}

module.exports = db.model('User', UserSchema);