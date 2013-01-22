var mongoose = require('mongoose')
    , db = require('./db')
    , supergoose = require('supergoose')
    , _ = require('underscore');

// Student Schema -----------------------------------
var AnswerSchema = new mongoose.Schema({
  stamp: Date
  , question_id: String
  , correct: { type: Boolean, default: false }
});
var StudentSchema = new mongoose.Schema({
  phone:      { type: String,         index: true }
  , lessons:  { type: [String],       default: [] }
  , schedule: { type: String }
  , email:    { type: String }
  , fullname: { type: String }
  , timezone: { type: String }
  , joined:   { type: Date,           default: new Date() }
  , answers:  { type: [AnswerSchema], default: [] }
});
StudentSchema.plugin(supergoose);
StudentSchema.virtual('id')
.get(function () {
  return this._id;
});

StudentSchema.methods.validPhone = function(str) {
  if (this.phone.length > 10) {
    return true;
  } else {
    return false;
  }
}

StudentSchema.statics.createStudent = function(phone, student_data, cb) {
  
  var student = new this();
  console.log("Does the student " + phone + " exist?");

  this.findOne({phone: phone}, function(err, exists) {
    if (exists === null) {

      console.log("It does not exist! Creating...");
      if (student_data.phone) student.phone = student_data.phone;
      if (student_data.studentname) student.studentname = student_data.studentname;
      if (student_data.password) student.password = student_data.password;

      student.save( function(err, student) {
        if (err) {
          cb(err, false);
        } else {
          cb(null, student);
        }
      });

    } else {

      console.log("It already exists! Aborting...");
      cb(null, false);
    }
  });

}


module.exports = db.model('Student', StudentSchema);
