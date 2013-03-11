var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = require('./db')
  , supergoose = require('supergoose')
  , Step = require('step')
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

LessonSchema.statics.updateLessons = function(callback) {
  // This should load all questions and update lessons collection
  // To be called right after importing

  /*
  var self = this;
  var qid = question._id;
  var lessons = question.lessons || [];

  Step(
    function update() {
      var group = this.group();

      _.each(lessons, function(l) {
        self.update({code: l}, {$addToSet: {questions: questionId}}, {upsert: true}, group());
      });
    },
    function finish(err) {
      if (err) {
        log.error('error!');
        log.error(err);
      }
      callback(null);
    }
  );
  */

  callback(null);

}

var LessonModel = db.model('Lesson', LessonSchema);

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
  , lessons:    [String]
  , feedback:   {
    correct: String
    , incorrect: String
  }
});
QuestionSchema.plugin(supergoose);

QuestionSchema.statics.upsertQuestion = function(universalId, question_data, cb) {
  var self = this;
  var findQuery = {universalId: universalId};
  var updateQuery = {$set: question_data};

  this.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, cb);
}

QuestionSchema.statics.findByLessons = function(lessons, cb) {
  this.find({lessons: {$in: lessons}}).exec(function(err, res) {
    cb(err, res);
  });
}

var QuestionModel = db.model('Question', QuestionSchema);

module.exports = {
  'Question': QuestionModel
  , 'Lesson': LessonModel
}