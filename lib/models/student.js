var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , db          = require('./db')
  , supergoose  = require('supergoose')
  , _           = require('underscore');

// ------------------------------------------------------------------------
// Student Model

var AnswerSchema = new Schema({
  stamp: Date
  , question: { type: Schema.Types.ObjectId, ref: 'Question' }
  , correct: { type: Boolean, default: false }
});

var scheduleOptions = ['morning', 'noon', 'afternoon', 'night'];
var timezoneOptions = ['PST', 'MST', 'CST', 'EST'];

var StudentSchema = new Schema({
  phone:        { type: String,           index: true }
  , externalId: { type: String,           index: true }

  , active:     { type: Boolean }
  , joined:     { type: Date }
  , confirmed:  { type: Date,             default: null }

  , schedule:   { type: [String] }
  , email:      { type: String }
  , firstname:  { type: String }
  , lastname:   { type: String }
  , channel:    { type: String }
  , zipcode:    { type: Number }
  , timezone:   { type: String,           default: timezoneOptions[0],    enum: timezoneOptions }
  
  , lessons:        { type: [String],     default: [] }
  , lessongroups:   { type: [String],     default: [] }

  , answers:    { type: [AnswerSchema], default: [] }
});
StudentSchema.plugin(supergoose);

StudentSchema.statics.validPhone = function(str) {
  if (str.length > 10) {
    return true;
  } else {
    return false;
  }
}

StudentSchema.statics.validateData = function(data, cb) {
  var valid = true;

/*
  if (data['phone']) {
    if (!this.validPhone(data['phone'])) {
      return cb(new Error('invalid phone: ' + data['phone']));  
    }
  }

  if (data['schedule']) {
    if (scheduleOptions.indexOf(data['schedule']) === -1) {
      return cb(new Error('invalid schedule: ' + data['schedule']));  
    }
  }

  if (data['timezone']) {
    if (timezoneOptions.indexOf(data['timezone']) === -1) {
      return cb(new Error('invalid timezone: ' + data['timezone'])); 
    }
  }

  if (data['email']) {
    var str = data['email'];
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    var validEmail = (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    if (!validEmail) {
      return cb(new Error('invalid email: ' + data['email'])); 
    }
  }
  */

  return cb(null, true);
}

StudentSchema.statics.loadData = function(externalId, cb) {
  var self = this;
  self.findOne({externalId: externalId}, cb);
}

StudentSchema.statics.upsertStudent = function(externalId, studentData, cb) {
  var self = this;
  log.info('upserting student ' + externalId + '...');

  this.validateData(studentData, function(err, valid) {
    if (valid) {
      var findQuery = {externalId: externalId};
      var updateQuery = {$set: studentData};
      self.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, function(err, newObj) {
        return cb(err, newObj);
      });
  } else {
    return cb(err);
  }
  });
}

StudentSchema.statics.activateStudent = function(externalId, activate, cb) {
  var self = this;
  log.info('upserting student ' + externalId + '...');

  var findQuery = {externalId: externalId};
  var updateQuery = {$set: {active: activate}};
  self.update( findQuery, updateQuery, function(err, affected) {
    return cb(err, affected);
  });
}

module.exports = db.model('Student', StudentSchema);
