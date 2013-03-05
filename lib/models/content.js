var mongoose = require('mongoose')
    , db = require('./db')
    , supergoose = require('supergoose')
    , _ = require('underscore');

var QuestionOptionSchema = new mongoose.Schema({
  text: String
  , correct: { type: Boolean, default: false }
});

var QuestionSchema = new mongoose.Schema({
  universal_id: { type: String, index: true }
  , text:       String
  , qoptions:   [QuestionOptionSchema]
  , feedback:   {
    correct: String
    , incorrect: String
  }
});

QuestionSchema.plugin(supergoose);
QuestionSchema.virtual('id')
.get(function () {
  return this.universal_id;
});


QuestionSchema.statics.upsertQuestion = function(universal_id, question_data, cb) {
  this.update({universal_id: universal_id}, {$set: question_data}, {upsert: true}, cb);
}

module.exports = {
  'Question': db.model('Question', QuestionSchema)
}