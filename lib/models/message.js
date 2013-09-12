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
  , created:      { type: Date,     default: null,   index: true }
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

  if (data.isAutomatedTest) {
    return cb(null);
  }

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

MessageSchema.statics.loadRecent = function(lastStamp, involvedNumber, cb) {
  var self = this;

  var query = {created: {'$gt': lastStamp}};

  if (involvedNumber) {
    var cond1 = {'to': involvedNumber};
    var cond2 = {'from': involvedNumber};
    query['$or'] = [ cond1, cond2 ];
  }

  self.find(query).sort({created: -1}).limit(10).exec(function(err, data) {
    if (data.length > 0) data.reverse();
    // log.debug('loaded ' + data.length + ' messages');
    return cb(err, data);
  });

}

module.exports = db.model('Message', MessageSchema);