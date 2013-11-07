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
  phone:        { type: String,     index: true }
  , externalId: { type: String }
  , partner:    { type: String }

  , active:      { type: Boolean,   default: true }
  , initialized: { type: Boolean,   default: false }
  , confirmed:   { type: Boolean,   default: false }
  , joined:      { type: Date }
  
  , timezone:   { type: String,     index: true }
  , schedule:   { type: [String] }
  
  , lessons:        { type: [String],     default: [] }
  , lessongroups:   { type: [String],     default: [] }

  , email:      { type: String }
  , firstname:  { type: String }
  , lastname:   { type: String }
  , channel:    { type: String }
  , zipcode:    { type: Number }

  , answers:                { type: [AnswerSchema], default: [] }
  
  , countDelivered:         { type: Number, default: 0 }
  , countAnswered:          { type: Number, default: 0 }
  , countCorrect:           { type: Number, default: 0 }

  , lastCorrectPercentage:  { type: Number, default: 0 }

  , totalDelivered:         { type: Number, default: 0 }
  , totalAnswered:          { type: Number, default: 0 }
  , totalCorrect:           { type: Number, default: 0 }
});
StudentSchema.index({ partner: 1, externalId: 1 });
StudentSchema.plugin(supergoose);

StudentSchema.statics.validateData = require('./validations/student_validation.js');

StudentSchema.statics.listAll = function(cb) {
  this.find({}).sort({active: -1, externalId: 1}).exec(cb);
}

StudentSchema.statics.deleteStudent = function(id, cb) {
  this.remove({_id: id}).exec(cb);
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


StudentSchema.statics.initializeStudent = function(findQuery, cb) {
  var self = this;

  var updateQuery = {$set: {initialized: true}};
  self.findOneAndUpdate( findQuery, updateQuery, {upsert: true, new: false}, function(err, newObj) {
    return cb(err, newObj);
  });

}

StudentSchema.methods.initialize = function(cb) {
  log.debug('initializing student...');
  return this.update({initialized: true}, function(err, affected) {
    log.success('done! (' + affected + ')');
    cb(err, affected);
  });
}

StudentSchema.methods.uninitialize = function(cb) {
  log.debug('uninitializing student...');
  return this.update({initialized: false}, function(err, affected) {
    log.success('done! (' + affected + ')');
    cb(err, affected);
  });
}

StudentSchema.methods.deactivate = function(cb) {
  log.debug('deactivating student...');
  return this.update({active: false}, function(err, affected) {
    log.success('done! (' + affected + ')');
    cb(err, affected);
  });
}

StudentSchema.methods.activate = function(cb) {
  log.debug('deactivating student...');
  return this.update({active: true}, function(err, affected) {
    log.success('done! (' + affected + ')');
    cb(err, affected);
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

  log.yellow('confirming student...');
  log.yellow(this);

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

  // Add answer
  var now = new Date();
  var newAnswer = {
    stamp: now
    , question: qid
    , correct: null
  };

  self.answers.push(newAnswer);
  self.countDelivered++;
  self.totalDelivered++;

  log.debug('setting last question = ' + qid + ' for user ' + self._id + ' (counter=' + self.countDelivered + ')');

  log.yellow('TOTAL // Delivered: ' + self.totalDelivered + ' / Answered: ' + self.totalAnswered + ' / Correct: ' + self.totalCorrect);
  log.yellow('COUNT // Delivered: ' + self.countDelivered + ' / Correct: ' + self.countCorrect);
  log.yellow('LAST PERCENTAGE // ' + self.lastCorrectPercentage + '%');


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

    self.totalAnswered++;
    self.countAnswered++;

    if (lastAnswer.correct) {
      self.countCorrect++;
      self.totalCorrect++;
    }

    log.debug(' > selected option:');
    log.debug(selectedOption);

    log.debug(' > updating answer...');
    self.save(function(err) {
      log.error('updating answer on answerQuestion()', err);
      log.success(' > answer updated!');

      // Process feedback
      var txtFeedback  = lastQuestion.feedback[ correctness ];
      var msgFeedback   = {
        phone: self.phone
        , message: txtFeedback
      };
      retPayload.push(msgFeedback);

      // Wait between feedback and next question
      var msgDelay      = {
        delay: delayAfterFeedback
      };
      retPayload.push(msgDelay);

      // Get next question
      self.getNextQuestion(true, {}, function(err, txtNextQuestion) {

        if (!txtNextQuestion) {
          txtNextQuestion = "Oops! We ran out of questions for you!";
        }

        var msgNextQuestion = {
          phone: self.phone
          , message: txtNextQuestion
        };
        retPayload.push(msgNextQuestion);

        log.debug(' > payload generated:');
        log.debug(retPayload);

        return cb(null, retPayload);

      });

    });
    
  });
}

StudentSchema.statics.sendCron = function(tz, schedule, cb) {
  var self = this;
  var sendOut = [];

  log.debug('finding recipients for cron: ' + tz + ' > ' + schedule);
  self.find({timezone: tz, schedule: schedule, confirmed: true, active: true}).exec(function(err, data) {
    if (err) {
      log.error(err, 'loading students for cron');
      return cb(err);
    }

    log.debug('found ' + data.length + ' students! building Bus events...');
    _.each(data, function(student) {
      sendOut.push({phone: student.phone, msg: 'N', isCron: true});
    });

    return cb(null, sendOut);
  });

};

StudentSchema.methods.resetCounter = function(lastCorrectPercentage, cb) {
  var self = this;

  self.lastCorrectPercentage = lastCorrectPercentage;
  self.countDelivered = 0;
  self.countAnswered = 0;
  self.countCorrect = 0;

  log.debug('resettingCounter (last %: ' + lastCorrectPercentage + ')');

  self.save(function(err) {
    log.error('setting resetting counter', err);
    return cb(err);
  });

};

StudentSchema.methods.getNextQuestion = function(flagAsSent, options, cb) {
  var self                  = this;
  var sendReport            = false;
  var lastCorrectPercentage = 99;

  var setLast = function(last_q, cb2) {
    if (flagAsSent) {
      self.setLastQuestion(last_q, cb2);
    } else {
      cb2(null);
    }
  }

  var resetCounter = function(per, cb3) {
    if (flagAsSent) {
      self.resetCounter(per, cb3);
    } else {
      cb2(null);
    }
  }

  // Progress reports
  if (self.countDelivered > 4) sendReport = true;
  if (options.isCron) sendReport = false;
  
  if (sendReport) { // if send report

    var perc  = (self.totalCorrect*100/self.totalAnswered);
    perc      = perc.toFixed(2);
    percDiff  = perc - self.lastCorrectPercentage;
    percDiff  = percDiff.toFixed(2);
    preffix   = ( percDiff > 0 ) ? "+" : "";

    var myText = "You just answered " + self.countCorrect + " of " + self.countAnswered + " questions correctly!";
    myText += "\n\nOverall stats:";
    myText += "\n" + self.totalCorrect + " of " + self.totalAnswered + " correct";
    myText += "\n=" + perc + "%";
    myText += "\n(" + preffix + percDiff + "% from last time)";
    myText += "\n\nReply N to get your next question.";

    resetCounter(perc, function(err) {
      return cb(null, myText);
    });

  } else {  // if send report

    self.getLessons(function(err, fullLessons) {
      log.success('getting next question from ' + fullLessons.length + ' lessons...');
      log.yellow(fullLessons);

      // Pluck answered question ids:
      var answeredQuestions = _.map(self.answers, function (elem) {
        return elem.question.toString();
      });
      log.debug(' -> ' + answeredQuestions.length + ' answered questions');

      // Load available questions
      ContentModel.Question.findByLessons(fullLessons, function(err, potentialQuestions) {
        log.debug(' -> ' + potentialQuestions.length + ' potential questions');

        // Filter out
        var finalQuestions = _.reject(potentialQuestions, function(item) {
          var curId = item.get('id');
          var myid = (answeredQuestions.indexOf(curId));
          return (myid > -1);
        });
        log.debug(' -> ' + finalQuestions.length + ' final questions');

        // All available questions have been answered? Randomize among all of them.
        if ((potentialQuestions.length > 0) && (finalQuestions.length == 0)) {
          finalQuestions = potentialQuestions;
        }

        // Do we have any?
        if (finalQuestions.length > 0) {

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

        } else {

          var errText = "Sorry, we cannot find any questions for you!";
          return cb(null, errText);

        }

      });
    });

  } // if send report

}

StudentSchema.statics.loadStats = function(cb) {
  var self = this;
  self.find({}).sort({joined: -1}).exec(function(err, results) {

    var newToday = 0;
    var activeToday = 0;

    var now   = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var todayStamp = +today;

    results.forEach(function(r) {
      var curStamp = +r.joined;
      if (curStamp > todayStamp) {
        newToday++;
      }
    });

    var ret = {
      total: results.length,
      newToday: newToday,
      activeToday: activeToday
    };
    return cb(err, ret);
  });
};

module.exports = db.model('Student', StudentSchema);
