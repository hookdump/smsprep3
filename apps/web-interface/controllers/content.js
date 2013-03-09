var _ = require('underscore');
var fs = require('fs');
var htmlImporter = require('../modules/htmlImporter.js');

var contentController = function(app, config, lib, passport) {
  log.loading('content controllers');

  // Content ----------------------------
  app.get('/content', function(req, res) {
    // Load lessons:
    // TODO: Load lessons
    var lessons = [
      {
        test_code: "SAT"
        , lesson_code: "FRACTIONS"
        , questions: []
      },
      {
        test_code: "SAT"
        , lesson_code: "EXPONENTIALS"
        , questions: []
      }
    ];

    // List HTML files:
    fs.readdir(config.upload_dir, function(err, files) {
      log.notice('listing files...');

      var filteredFiles = _(files).reject(function(file) {
        return (file.match(/[.]/) === null);
      });

      res.render('content', { title: config.title, cur_section: "content", lessons: lessons, files: filteredFiles });  
    });
    
  });

  // Content: Import ----------------------------
  app.get('/content/import/:filename', function(req, res) {
    res.render('content_import', { title: config.title, cur_section: "content_import", import_filename: req.params.filename });  
  });

  // Content review ----------------------------
  app.get('/content/:code', function(req, res) {
    var full_code = req.params.code;
    var codes = full_code.split("_");
    var code_data = {
      full_code: full_code
      , test_code: codes[0]
      , lesson_code: codes[1]
    };

    var questions = [
      {
        text: "What is 2+2?"
        , id: "1"
        , options: [
          {text: "5", correct: false}
          , {text: "7", correct: false}
          , {text: "4", correct: true}
        ]
        , feedback: {
          "correct": "Yeah! That was easy, wasn't it?"
          , "incorrect": "Nooo! 2+2 equals 4 because blah blah blah"
        }
      },
      {
        text: "What is 10+5?"
        , id: "2"
        , options: [
          {text: "15", correct: true}
          , {text: "17", correct: false}
          , {text: "5", correct: false}
        ]
        , feedback: {
          "correct": "Yeah! That was easy, wasn't it?"
          , "incorrect": "Nooo! 10 + 5 equals 15 because blah blah blah"
        }
      }
    ];

    res.render('content_detail', { title: config.title, cur_section: "content_detail", codes: code_data, questions: questions });  
  });

}

var contentIo = function(socket, config, lib) {
  socket.on('content.import', function (data) {
    var import_filename = data.import_filename;
    log.notice('starting file import: ' + import_filename);

    var reportProgress = function(value, msg, questions) {
      log.notice('sending progress: ' + value + '%');
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
      log.success('finished importing! YAY!');
      socket.emit('content.import.progress', {val: 100, msg: null}) 
      socket.emit('content.import.finished', {import_filename: import_filename});
    });

  });
}

module.exports.web = contentController;
module.exports.io  = contentIo;