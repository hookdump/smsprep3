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
var timezoneOptions = [-8, -7, -6, -5];

var StudentSchema = new Schema({
  phone:      { type: String,         index: true }
  , partnerId:{ type: String,         index: true }
  , lessons:  { type: [String],       default: [] }
  , schedule: { type: String,         default: scheduleOptions[0],    enum: scheduleOptions }
  , email:    { type: String }
  , fullname: { type: String }
  , timezone: { type: Number,         default: timezoneOptions[0],    enum: timezoneOptions }
  , joined:   { type: Date }
  , answers:  { type: [AnswerSchema], default: [] }
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

  return cb(null, true);
}

StudentSchema.statics.upsertStudent = function(partnerId, studentData, cb) {
  var self = this;
  this.validateData(studentData, function(err, valid) {
    if (valid) {
      var findQuery = {partnerId: partnerId};
      var updateQuery = {$set: studentData};
      self.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, function(err, newObj) {
        cb(err, newObj);
      });
  } else {
    cb(err);
  }
  });
}

module.exports = db.model('Student', StudentSchema);
