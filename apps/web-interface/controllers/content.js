var _ = require('underscore');
var fs = require('fs');
var htmlImporter = require('../modules/htmlImporter.js');
var Step = require('step');

var contentController = function(app, config, lib, passport) {
  log.loading('content controllers');

  // Content ----------------------------
  app.get('/content', function(req, res) {

    Step(

      function _loadLessons() {

        // Load lessons:
        log.notice('loading lessons...');
        lib.Content.Lesson.findAll(this);

      },
      function _loadFiles(err, loadedLessons) {      

        // List HTML files:
        fs.readdir(config.upload_dir, function(err, files) {
          log.notice('listing files...');

          var filteredFiles = _(files).reject(function(file) {
            return (file.match(/[.]/) === null);
          });

          res.render('content', { title: config.title, cur_section: "content", lessons: loadedLessons, files: filteredFiles });  
        });
      }

    );
    
  });

  // Content: Import ----------------------------
  app.get('/content/import/:filename', function(req, res) {
    res.render('content_import', { title: config.title, cur_section: "content_import", import_filename: req.params.filename });  
  });

  // Content review ----------------------------
  app.get('/content/:lesson', function(req, res) {
    var full_code = req.params.lesson;
    var codes = full_code.split("-");
    var code_data = {
      full_code: full_code
      , test_code: codes[0]
      , lesson_code: codes[1]
    };

    var lessonQuestions = lib.Content.Lesson.loadQuestions({code: full_code}, function(err, qs) {
      res.render('content_detail', { title: config.title, cur_section: "content_detail", codes: code_data, questions: qs });  
    });
    
  });

  // Content review ----------------------------
  app.get('/content/:lesson/:question', function(req, res) {
    var unversalId = req.params.question;
    var lesson = req.params.lesson;
    lib.Content.Question.load(unversalId, function(err, qdata) {
      res.render('question_detail', { title: config.title, cur_section: "question_detail", question_data: qdata, current_lesson: lesson });  
    });
  });

  app.post('/content/:lesson/:question', function(req, res) {
    var unversalId = req.params.question;
    var lesson = req.params.lesson;
    var questionData = req.body.questionData;

    lib.Content.Question.upsertQuestion(unversalId, questionData, function(err, qdata) {
      if (err) {
        res.json({success: false, error: err});
      } else {
        res.json({success: true});  
      }
    });
  });
  

}



var contentIo = function(socket, config, lib) {
  socket.on('content.import', function (data) {
    var import_filename = data.import_filename;
    log.notice('starting file import: ' + import_filename);

    var reportProgress = function(value, msg, questions) {
      log.notice('importing: ' + value + '%');
      socket.emit('content.import.progress', {val: value, msg: msg});

      if (questions) {
        socket.emit('content.import.questions', {data: questions});
      }
    }

    var file = config.upload_dir + import_filename;
    log.notice('loading file...');
    var raw_data = fs.readFileSync(file).toString();

    log.notice('processing data...');
    htmlImporter.processRawData(raw_data, lib, reportProgress, function() {
      log.success('import completed!');
      socket.emit('content.import.progress', {val: 100, msg: null}) 
      socket.emit('content.import.finished', {import_filename: import_filename});
    });

  });
}

module.exports.web = contentController;
module.exports.io  = contentIo;