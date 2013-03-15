var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = require('./db')
  , supergoose = require('supergoose')
  , Step = require('step')
  , _ = require('underscore');


// ------------------------------------------------------------------------
// Category Model

var CategorySchema = new Schema({
  name: { type: String, index: true }
  , questionCount: Number
  , partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null }
});

CategorySchema.statics.updateCategories = function(callback) {
  // This should load all questions and update categories collection
  // To be called right after importing



  callback(null);
}


// ------------------------------------------------------------------------
// Lesson Model

var LessonSchema = new Schema({
  code: { type: String, index: true }
  , questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

LessonSchema.statics.findAll = function(callback) {
  this.find({}, callback);
}

LessonSchema.statics.loadQuestions = function(query, callback) {
  var result = [];
  this.find(query).populate('questions').exec(function(err, docs) {
    var questionGroups = _(docs).pluck('questions')
    var questions = _.flatten( questionGroups, true );
    callback(err, questions);
  });
}

LessonSchema.statics.updateLessons = function(callback) {
  // This should load all questions and update lessons collection
  // To be called right after importing

  var self = this;
  var newLessons = {};
  log.info('updating lessons...');

  Step(
    function cleanUpLessons() {
      // Delete all lessons
      log.notice('deleting lessons...');
      self.remove(this);

    },
    function loadQuestions(err) {
      log.error('cleaning up lessons', err);
      log.notice('loading questions...');

      // Go through every question, grouping by lesson
      self.model('Question').find({}, this);
    },
    function groupLessons(err, docs) {
      log.error('loading questions', err);
      log.notice('grouping lessons... (' + docs.length + ' docs)');

      _(docs).each(function(question) {

        // Going through every question
        _(question.lessons).each(function(lesson) {

          // Each lesson of it
          if (!newLessons[lesson]) newLessons[lesson] = [];
          newLessons[lesson].push( question._id );
          log.notice('adding lesson ' + lesson);

        });

      });

      this();
    },
    function updateLessonDocuments() {
      // Store these groups
      log.notice('finished grouping lessons!');
      log.notice('updating lessons...');
      log.notice( _(newLessons).keys().length  + ' lessons!' );
      log.info( newLessons );

      var group = this.group();
      _(newLessons).each( function(questions, lesson) {
        self.create({code: lesson, questions: questions}, group());
      });

      this();
    },
    function theEnd(err, lastDoc) {
      log.error('updating lessons', err);
      log.notice('finished updating lessons!');
      
      callback(null);
    }
  );



    /*
    function update() {
      var group = this.group();

      _.each(lessons, function(l) {
        self.update({code: l}, {$addToSet: {questions: questionId}}, {upsert: true}, group());
      });
    },
    function finish(err) {

      callback(null);
    }
  );
*/

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

  log.info( 'upserting question ' + universalId );
  log.notice( question_data );
  this.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: true}, function(err, doc) {
    log.error('upserting question', err);
    cb(err, doc);
  });
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