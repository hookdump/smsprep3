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
  app.get('/content/lesson/:code', function(req, res) {
    var full_code = req.params.code;
    var codes = full_code.split("-");
    var code_data = {
      full_code: full_code
      , test_code: codes[0]
      , lesson_code: codes[1]
    };

    var lessonQuestions = lib.Content.Lesson.loadQuestions({code: full_code}, function(err, qs) {

      log.warn('questions:');
      log.warn( qs );
      res.render('content_detail', { title: config.title, cur_section: "content_detail", codes: code_data, questions: qs });  
    });
    
  });

  // Content review ----------------------------
  app.get('/content/question/:code', function(req, res) {
   /*
    var full_code = req.params.code;
    var codes = full_code.split("-");
    var code_data = {
      full_code: full_code
      , test_code: codes[0]
      , lesson_code: codes[1]
    };

    var lessonQuestions = lib.Content.Lesson.loadQuestions({code: full_code}, function(err, qs) {

      log.warn('questions:');
      log.warn( qs );
      res.render('content_detail', { title: config.title, cur_section: "content_detail", codes: code_data, questions: qs });  
    });
    */  
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