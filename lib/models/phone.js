var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , db          = require('./db')
  , supergoose  = require('supergoose')
  , _           = require('underscore');

// ------------------------------------------------------------------------
// Phone Model

var PhoneSchema = new Schema({
  number:         { type: String,   index: true }
  , status:       { type: String,   default: null }
  , initialized:  { type: Date,     default: null }
  , stopped:      { type: Date,     default: null }
  , lastError:    { type: String,   default: null }
});
PhoneSchema.virtual('id')
.get(function () {
  return this._id;
});

PhoneSchema.statics.flagInitialized = function(number, cb) {
  var self = this;
  var now = new Date();
  var updateQuery = {$set: {initialized: now}};

  self.findOneAndUpdate( {number: number} , updateQuery, {upsert: true, new: true}, function(err, newObj) {
    return cb(err, newObj);
  });
}

PhoneSchema.statics.flagStopped = function(number, cb) {
  var self = this;
  var now = new Date();
  var updateQuery = {$set: {initialized: now}};

  self.findOneAndUpdate( {number: number} , updateQuery, {upsert: true, new: true}, function(err, newObj) {
    return cb(err, newObj);
  });
}

module.exports = db.model('Phone', PhoneSchema);