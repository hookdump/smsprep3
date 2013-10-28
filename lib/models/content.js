var mongoose      = require('mongoose')
  , Schema        = mongoose.Schema
  , db            = require('./db')
  , supergoose    = require('supergoose')
  , _             = require('underscore')
  , Step          = require('step')
  , myUtils       = require('../utils.js');

var textValidationRegex = /^[\w\s.,=!?]*$/;

// Definitions:

var CategorySchema = new Schema({
  name: { type: String, index: true }
  , questionCount: Number
  , partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null }
});

var LessonSchema = new Schema({
  code: { type: String, index: true }
  , group: { type: String, index: true }
  , questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

var QuestionOptionSchema = new Schema({
  text: String
  , correct: { type: Boolean, default: false }
});
QuestionOptionSchema.methods.build = function(index) {
  var selfOpt = this;
  var myLetter = myUtils.indexToOption(index);
  return myLetter + ") " + selfOpt.text;
}

var QuestionSchema = new Schema({
  universalId: { type: String, index: true }
  , text:       String
  , qoptions:   [QuestionOptionSchema]
  , lessons:    [String]
  , valid:      Boolean
  , feedback:   {
      correct:      String
    , incorrect:    String
  }
});
QuestionSchema.plugin(supergoose);

// ------------------------------------------------------------------------
// Category Model

CategorySchema.statics.updateCategories = function(callback) {
  // This should load all questions and update categories collection
  // To be called right after importing


  callback(null);
}


// ------------------------------------------------------------------------
// Lesson Model

LessonSchema.statics.findAll = function(callback) {
  this.find({}).exec(callback);
}

LessonSchema.statics.loadSummary = function(callback) {
  this.find({}).sort({group: 1}).exec(function(err, data) {

    var list = _.map(data, function(item) {
      return {'code': item.code, 'group': item.group, 'count': item.questions.length};
    });

    var list2 = _.groupBy(list, function(item) {
      return item.group;
    });

    return callback(err, _.keys(list2), list2);
  });
}

LessonSchema.statics.findAllCodes = function(callback) {
  this.find({}).select('code').exec(function(err, data) {
    var data2 = _(data).pluck('code');
    callback(err, data2);
  });
}

LessonSchema.statics.findLessonsByGroup = function(lessonGroup, cb) {
  var myQuery = {group: lessonGroup};
  this.find(myQuery).exec(function(err, data) {
    log.error('loading group ' + lessonGroup, err);

    log.debug('finishing loading group ' + lessonGroup);
    var data2 = _.pluck(data, 'code');
    log.debug(data2);
    
    cb(err, data2);
  });
}

LessonSchema.statics.resolveGroup = function(groups, resolved, cb) {
  var self = this;

  if (groups.length == 0) {
    log.debug('resolved everything! got ' + resolved.length + ' lessons. calling back...');
    cb(null, resolved);
  } else {
    var nextGroup = groups.shift();
    log.debug('resolving lesson group: ' + nextGroup);
    self.findLessonsByGroup(nextGroup, function(err, loaded) {
      log.error('resolving lesson group: ' + nextGroup, err);

      var newResolved = resolved.concat(loaded);
      log.debug(' * lessons resolved so far: ' + newResolved.length);
      self.resolveGroup(groups, newResolved, cb);
    });
  }
}

LessonSchema.statics.resolveGroups = function(groups, callback) {
  this.resolveGroup(groups, [], callback);
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
        var myGroup = lesson.split("-")[0];
        self.create({code: lesson, group: myGroup, questions: questions}, group());
      });

      this();
    },
    function theEnd(err, lastDoc) {
      log.error('updating lessons', err);
      log.notice('finished updating lessons!');
      
      callback(null);
    }
  );

}

var LessonModel = db.model('Lesson', LessonSchema);

// ------------------------------------------------------------------------
// Question Model

QuestionSchema.statics.checkQuestionSanity = function( data_object ) { 
  var txt = data_object.text;

  if (data_object.feedback) {
    txt += "," + data_object.feedback.correct + data_object.feedback.incorrect;
  }

  if (data_object.qoptions) {
    data_object.qoptions.forEach( function(element, index) {
      txt += "," + element.text;
    });
  }

  var result = this.validText(txt);
  return result;
}

QuestionSchema.statics.validText = function(text) {
  var res = text.match( textValidationRegex );
  return (res != null);
}

QuestionSchema.statics.upsertQuestion = function(universalId, question_data, cb) {
  var self = this;
  
  // Check data sanity
  var validData = this.checkQuestionSanity( question_data );
  question_data.valid = validData;

  // Build queries
  var findQuery = {universalId: universalId};
  var updateQuery = {$set: question_data};

  // Upsert!
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

QuestionSchema.statics.load = function(universalId, cb) {
  this.findOne({universalId: universalId}).exec(function(err,data) {
    log.error('loading question: ' + universalId, err);
    cb(err, data);
  });
}

QuestionSchema.methods.buildMessage = function() {
  var self = this;
  var message = "";

  message += self.text;

  // do we need to append options?
  if (self.qoptions) {
    var firstOption = self.qoptions[0].text;
    var appendOptions = (firstOption !== 'a');

    if (appendOptions) {
      _.each(self.qoptions, function(el, index) {
        message += "\n";
        message += el.build(index);
      });
    }
  }

  return message;
}

var QuestionModel = db.model('Question', QuestionSchema);

module.exports = {
  'Question': QuestionModel
  , 'Lesson': LessonModel
}