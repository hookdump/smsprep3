var mongoose = require('mongoose')
    , db = require('./db')
    , supergoose = require('supergoose')
    , _ = require('underscore');

var QuestionOptionSchema = new mongoose.Schema({
  text: String
  , correct: { type: Boolean, default: false }
});

var QuestionSchema = new mongoose.Schema({
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
}