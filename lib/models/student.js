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

var StudentSchema = new Schema({
  phone:        { type: String,           index: true }
  , externalId: { type: String }
  , partner:    { type: String }

  , active:     { type: Boolean,          default: true }
  , confirmed:  { type: Boolean,          default: false }
  , joined:     { type: Date }

  , schedule:   { type: [String] }
  , email:      { type: String }
  , firstname:  { type: String }
  , lastname:   { type: String }
  , channel:    { type: String }
  , zipcode:    { type: Number }
  , timezone:   { type: String }
  
  , lessons:        { type: [String],     default: [] }
  , lessongroups:   { type: [String],     default: [] }

  , answers:    { type: [AnswerSchema], default: [] }
});
StudentSchema.index({ partner: 1, externalId: 1 });
StudentSchema.plugin(supergoose);

StudentSchema.statics.validateData = function(data, method, callback) {
  var errors = [];
  var validation = {
    phone_regex: /^[19][0-9]{10}$/
    , zipcode_regex: /^[0-9]{5}$/
    , email_regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    , timezones_list: ['EST', 'MST', 'CST', 'PST']
    , schedules_list: ['morning', 'afternoon', 'evening', 'night']
  }

  // Check mandatory fields --------------------------------
  if (method === 'start') {
    if (!data.phone)                      errors.push('you must specify the [phone] field when creating a student');
    if (!data.timezone && !data.zipcode)  errors.push('you must specify either the [timezone] or [zipcode] field when creating a student');
    if (!data.schedule)                   errors.push('you must specify the [schedule] field when creating a student');
  }

  // Validate arguments
  if (data.phone) {
    if (!data.phone.match(validation.phone_regex)) {
      errors.push('the [phone] provided (' + data.phone + ') is invalid! it must be a 11-digit number, starting with 1');
    }
  }

  if (data.timezone) {
    if (validation.timezones_list.indexOf(data.timezone) === -1) {
      errors.push('the [timezone] provided (' + data.timezone + ') is invalid! it must be one of these: [EST, MST, CST, PST]');
    }
  }

  if (data.zipcode) {
    if (!data.zipcode.match(validation.zipcode_regex)) {
      errors.push('the [zipcode] provided (' + data.zipcode + ') is invalid! it must be a 5-digit number');
    }
  }

  if (data.schedule) {
    if (!(data.schedule instanceof Array)) {
      var scheduleArr = data.schedule.split("+");
    } else {
      scheduleArr = data.schedule;
    }
    
    var validSchedules = _.every(scheduleArr, function(el) {
      return (validation.schedules_list.indexOf(el) !== -1);
    });
    if (!validSchedules) {
      errors.push('the [schedule] provided (' + data.schedule + ') is invalid! it must be one of these: [morning, afternoon, evening, night] or a combination of them');
    } else {
      data.schedule = scheduleArr;
    }
  }

  if (data.email) {
    if (!data.email.match(validation.email_regex)) {
      errors.push('the [email] provided (' + data.email + ') is invalid!');
    }
  }

  if (data.lessons) {
    if (!(data.lessons instanceof Array)) {
      var lessonsArr = data.lessons.split("+");
      data.lessons = lessonsArr;
    }
  }
  if (data.lessons === "") {
    log.info('no lessons, putting empty array here!');
    data.lessons = [];
  }

  if (data.lessongroups) {
    if (!(data.lessons instanceof Array)) {
      var lessonGroupsArr = data.lessongroups.split("+");
      data.lessongroups = lessonGroupsArr;
    }
  }
  if (data.lessongroups === "") {
    log.info('no lessongroups, putting empty array here!');
    data.lessongroups = [];
  }


  var result = {
    success: (errors.length === 0)
    , error_messages: errors
  };
  callback(null, data, result);
}

StudentSchema.statics.listAll = function(cb) {
  this.find({}).sort({active: -1, externalId: 1}).exec(cb);
}

StudentSchema.statics.loadData = function(findQuery, cb) {
  this.findOne(findQuery, cb);
}

StudentSchema.statics.execUpsert = function(findQuery, studentData, cb) {
  var self = this;
  log.info('upserting student ' + findQuery.externalId + '@' + findQuery.partner);
  
  // var findQuery = {externalId: externalId};
  var updateQuery = {$set: studentData};
  self.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, function(err, newObj) {
    return cb(err, newObj);
  });
}

StudentSchema.statics.upsertStudent = function(findQuery, data, method, cb) {
  var self = this;

  // Creating student? Initialize "joined" field
  if (method == 'start') {
    data.joined = Date.now();
    data.active = true;
  }

  // Validate data:
  self.validateData(data, method, function(err, studentData, result) {

    if (result.success) {

      self.execUpsert( findQuery, studentData, function(err, loadedStudent) {
        log.error('upserting student', err);
        cb(err, loadedStudent);
      });

    } else {

      cb({errors: result.error_messages});
    }
    
  });
}

StudentSchema.statics.activateStudent = function(findQuery, activate, cb) {
  var updateQuery = {$set: {active: activate}};
  this.update( findQuery, updateQuery, function(err, affected) {
    return cb(err, affected);
  });
}

module.exports = db.model('Student', StudentSchema);
