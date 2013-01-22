var mongoose = require('mongoose')
    , db = require('./db')
    , supergoose = require('supergoose')
    , _ = require('underscore');

var QuestionOptionSchema = new mongoose.Schema({
  text: String
  , correct: { type: Boolean, default: false }
});

var FeedbackSchema = new mongoose.Schema({
  correct: String
  , incorrect: String
});

var QuestionSchema = new mongoose.Schema({
  universal_id:   { type: String,         index: true }
  , text:         { type: String }
  , options:      { type: [QuestionOptionSchema] }
  , feedback:     { type: FeedbackSchema }
});

QuestionSchema.plugin(supergoose);
QuestionSchema.virtual('id')
.get(function () {
  return this.universal_id;
});

StudentSchema.statics.createQuestion = function(phone, student_data, cb) {
  
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

module.exports = db.model('Question', QuestionSchema);
