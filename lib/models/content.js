var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = require('./db')
  , supergoose = require('supergoose')
  , _ = require('underscore');


// ------------------------------------------------------------------------
// Lesson Model

var LessonSchema = new Schema({
  code: { type: String, index: true }
  , questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

LessonSchema.statics.findAll = function(callback) {
  var lessons = [
    {
      code: "SAT_MATH-FRACTIONS"
      , questions: []
    },
    {
      code: "SAT_MATH-EXPONENTIALS"
      , questions: []
    }
  ];

  callback(null, lessons);
}

// ------------------------------------------------------------------------
// Question Model

var QuestionOptionSchema = new Schema({
  text: String
  , correct: { type: Boolean, default: false }
});

var QuestionSchema = new Schema({
  universalId: { type: String, index: true }
  , text:       String
  , qoptions:   [QuestionOptionSchema]
  , feedback:   {
    correct: String
    , incorrect: String
  }
});
QuestionSchema.plugin(supergoose);

QuestionSchema.statics.upsertQuestion = function(universalId, question_data, cb) {
  var findQuery = {universalId: universalId};
  var updateQuery = {$set: question_data};
  this.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, function(err, newObj) {
    cb(err, newObj);
  });
}

module.exports = {
  'Question': db.model('Question', QuestionSchema)
  , 'Lesson': db.model('Lesson', LessonSchema)
}