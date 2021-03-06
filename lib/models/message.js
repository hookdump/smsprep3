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

  if (data.msg == '') {
    log.warn('Wanted to save an empty message? Abort!');
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

MessageSchema.statics.loadStats = function(days, cb) {
  var self            = this;
  var now             = new Date().getTime();
  var aDay            = 24 * 60 * 60 * 1000;
  var firstStamp      = now - 30 * aDay; // -30 days
  var thirtyDaysAgo   = new Date(firstStamp);
  var thirtyDaysAgoSt = thirtyDaysAgo.getTime();
  var days            = {};

  var formatDate = function(x) {
    var d = new Date(x.getFullYear(), x.getMonth(), x.getDate());
    return d.getTime();
    //return x.getFullYear() + '-' + (x.getMonth()+1) + '-' + x.getDate();
  }

  // 1. fill hashes
  log.debug('preparing date hashes...');
  var i = 0;
  for(i=0; i<=30; i++) {
    var st      = thirtyDaysAgoSt + aDay*i;
    var newDate = new Date(st);
    var hash    = formatDate(newDate);
    days[hash] = 0;
  }

  var query = {created: {'$gt': thirtyDaysAgo}};
  self.find(query).sort({created: -1}).exec(function(err, data) {
    
    // 1. group by day
    data.forEach(function(d) {
      var curHash = formatDate(d.created);
      days[curHash]++;
    });

    return cb(err, days);
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

  self.find(query).sort({created: -1}).limit(100).exec(function(err, data) {
    if (data.length > 0) data.reverse();
    // log.debug('loaded ' + data.length + ' messages');
    return cb(err, data);
  });

}

MessageSchema.statics.loadAll = function(cb) {
  var self = this;
  var query = {};

  self.find(query).sort({created: -1}).exec(function(err, data) {
    // if (data.length > 0) data.reverse();
    return cb(err, data);
  });

}

module.exports = db.model('Message', MessageSchema);