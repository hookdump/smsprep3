var mongoose      = require('mongoose')
  , Schema        = mongoose.Schema
  , db            = require('./db')
  , supergoose    = require('supergoose')
  , _             = require('underscore')
  , ContentModel  = require('./content')
  , myUtils       = require('../utils.js');

var delayAfterFeedback = 5000;

// ------------------------------------------------------------------------
// Student Model

var AnswerSchema = new Schema({
  stamp: Date
  , question:   { type: Schema.Types.ObjectId, ref: 'Question' }
  , correct:    { type: Boolean, default: false }
});

var StudentSchema = new Schema({
  phone:        { type: String,           index: true }
  , externalId: { type: String }
  , partner:    { type: String }

  , active:      { type: Boolean, default: true }
  , initialized: { type: Boolean, default: false }
  , confirmed:   { type: Boolean, default: false }
  , joined:      { type: Date }

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

StudentSchema.statics.validateData = require('./validations/student_validation.js');

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
        return cb(err, loadedStudent);
      });

    } else {
      return cb({errors: result.error_messages});
    }

  });

}

StudentSchema.statics.activateStudent = function(findQuery, activate, cb) {
  var updateQuery = {$set: {active: activate}};
  this.update( findQuery, updateQuery, function(err, affected) {
    return cb(err, affected);
  });
}

StudentSchema.methods.confirm = function(cb) {
  this.confirmed = true;
  this.save(cb);
}

StudentSchema.methods.getLessons = function(cb) {
  var self = this;
  
  // Initialize
  var myLessons = self.lessons;
  var myLessonGroups = self.lessongroups;

  if (myLessonGroups) {
    // Resolve lessongroups
    log.debug('resolving...');
    ContentModel.Lesson.resolveGroups(myLessonGroups, function(err, addLessons) {
      myLessons = myLessons.concat(addLessons);

      // Go on...
      log.info('resolved! total lessons: ' + myLessons.length);
      return cb(err, myLessons);
    });
  } else {
    return cb(null, myLessons);
  }

}

StudentSchema.methods.setLastQuestion = function(qid, callback) {
  var self = this;
  log.debug('setting last question = ' + qid + ' for user ' + self._id);

  // Add answer
  var now = new Date();
  var newAnswer = {
    stamp: now
    , question: qid
    , correct: null
  };

  self.answers.push(newAnswer);
  self.save(function(err) {
    log.error('setting last question', err);
    return callback(err);
  });

}

StudentSchema.methods.answerQuestion = function(answerMsg, cb) {
  var self            = this;
  var optionIndex     = myUtils.optionToIndex(answerMsg);
  var myAnswers       = self.answers;
  var lastAnswer      = _(myAnswers).last();
  var lastQuestionId  = lastAnswer.question;
  var now             = new Date();
  var retPayload      = [];

  if (lastAnswer.correct !== null) {
    // We have no pending questions! This answer makes no sense!
    var errMsg = "You have no pending questions! Please text N to get a new question.";
    retPayload.push({
      phone: self.phone
      , message: errMsg
    });
    return cb(null, retPayload);
  }

  log.warn('processing answer');
  log.debug('student: ' + self._id);
  log.debug('last question id: ' + lastQuestionId);

  ContentModel.Question.findById(lastQuestionId, function(err, lastQuestion) {
    log.error('loading question on answerQuestion()', err);

    if (!lastQuestion) {
      var newErr = new Error('processing answer for an inexistent question (' + lastQuestionId + ')');
      log.error('loading question on answerQuestion()', newErr);
      return cb(newErr, []);
    }

    log.success('question loaded!');

    // Save result
    var selectedOption  = lastQuestion.qoptions[ optionIndex ];
    var correctness     = selectedOption.correct ? 'correct' : 'incorrect';
    lastAnswer.correct  = selectedOption.correct;
    lastAnswer.stamp    = now;

    log.debug(' > selected option:');
    log.debug(selectedOption);

    log.debug(' > updating answer...');
    self.save(function(err) {
      log.error('updating answer on answerQuestion()', err);

      // Define feedback
      log.success(' > answer updated!');

      var sendFeedback  = lastQuestion.feedback[ correctness ];
      var msgFeedback   = {
        phone: self.phone
        , message: sendFeedback
      };
      var msgDelay      = {
        delay: delayAfterFeedback
      };
      retPayload.push(msgFeedback);
      retPayload.push(msgDelay);

      log.debug(' > payload generated:');
      log.debug(retPayload);

      return cb(null, retPayload);
    });
    
  });
}

StudentSchema.methods.getNextQuestion = function(flagAsSent, cb) {
  var self = this;

  var setLast = function(last_q, cb2) {
    if (flagAsSent) {
      self.setLastQuestion(last_q, cb2);
    } else {
      cb2(null);
    }
  }

  self.getLessons(function(err, fullLessons) {
    log.success('getting next question from ' + fullLessons.length + ' lessons...');

    // Pluck answered question ids:
    var answeredQuestions = _.pluck(self.answers, 'question');
    log.debug(' -> ' + answeredQuestions.length + ' answered questions');

    // Load available questions
    ContentModel.Question.findByLessons(fullLessons, function(err, potentialQuestions) {
      log.debug(' -> ' + potentialQuestions.length + ' potential questions');

      // Filter out
      var finalQuestions = _.reject(potentialQuestions, function(item) {
        return (answeredQuestions.indexOf(item) > -1);
      });
      log.debug(' -> ' + finalQuestions.length + ' final questions');

      // Pick one at random
      var randomIndex = _.random(0, finalQuestions.length-1);
      selectedQuestion = finalQuestions[ randomIndex ];
      var myText = selectedQuestion.buildMessage();
      log.success(' -> selected question: ' + selectedQuestion.universalId + ' (len=' + myText.length + ')');

      // Flag as sent
      setLast(selectedQuestion._id, function(err) {

        // Call back
        return cb(null, myText);

      });

    });

  });
}

module.exports = db.model('Student', StudentSchema);
