var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , db          = require('./db')
  , supergoose  = require('supergoose')
  , _           = require('underscore');

// ------------------------------------------------------------------------
// Message Model

var MessageSchema = new Schema({
  from:           { type: String,   index: true }
  , to:           { type: String,   index: true }
  , msg:          { type: String }
  , created:      { type: Date,     default: null }
  , delivered:    { type: Date,     default: null }
  , lastError:    { type: String,   default: null }
  , test:         { type: Boolean,  default: false }
});
MessageSchema.virtual('id')
.get(function () {
  return this._id;
});

MessageSchema.statics.create = function(data, cb) {
  var self = this;
  var message = new this();

  // initialize new message
  var now = new Date();
  message.created = now;

  message.from  = data.from;
  message.to    = data.to;
  message.msg   = data.msg;
  if (data.test) message.test = true;

  message.save( function(err, created) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, created);
    }
  });

}

module.exports = db.model('Message', MessageSchema);