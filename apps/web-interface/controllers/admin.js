var Core  = require('../../smsprep-core/modules/core');
var fs    = require('fs');
var _     = require('underscore');

var htmlImporter  = require('../modules/htmlImporter.js');
var Step          = require('step');

var adminController = function(app, config, lib, passport) {
  log.loading('admin controllers');

  Core.init(lib);

  // Dashboard ----------------------------
  app.get('/admin', function(req, res) {
    if (req.user) {

      var info = {};
      lib.CronDelivery.loadRecent(function(err, lastCrons) {
        info.lastCrons = lastCrons;
        res.render('admin', { title: config.title, cur_section: "admin", page_title: "Dashboard", bread_current: "Dashboard", info: info });  
      });

    } else {

      res.redirect('/login');

    }    
  });


  // Messages ----------------------------
  app.get('/admin/messages', lib.Utils.requireRole('admin'), function(req, res) {
    res.render('admin/messages', { title: config.title, cur_section: "messages", page_title: "Messages", bread_current: "Messages"});
  });

  // Fetch Messages ----------------------------
  app.get('/admin/messages/load', lib.Utils.requireRole('admin'), function(req, res) {
    var lastStamp = req.query['lastStamp'];
    var involvedNumber = req.query['involvedNumber'] || null;
    lib.Message.loadRecent(lastStamp, involvedNumber, function(err, results) {
      res.json({success: true, messages: results})
    });
  });

  // Fetch Messages ----------------------------
  app.post('/admin/messages/emulate', lib.Utils.requireRole('admin'), function(req, res) {
    var myphone = req.body.phone;
    var mymsg = req.body.msg;
    var lastStamp = req.body.lastStamp;

    log.debug('emulating msg from #' + myphone + ': ' + mymsg);
    
    Core.receiveMessage(myphone, mymsg, null, function(err, response) {
      
      // done! now refresh messages.
      lib.Message.loadRecent(lastStamp, null, function(err, results) {

        // only store to database!
        log.debug('emulated response:');
        log.warn(response);  
        lib.Bus.publish('sms.out', {test: true, payload: response});

        res.json({success: true, messages: results})
      });

    });
  });







  // Students ----------------------------
  app.get('/admin/students', lib.Utils.requireRole('admin'), function(req, res) {
    lib.Student.listAll(function(err, myList) {
      res.render('admin/students', { title: config.title, cur_section: "students", page_title: "Students", bread_current: "Students", students: myList });
    });
  });



  // Content ----------------------------
  app.get('/admin/content', lib.Utils.requireRole('admin'), function(req, res) {

    // List HTML files:
    fs.readdir(config.upload_dir, function(err, files) {
      log.notice('listing files...');

      var filteredFiles = _(files).reject(function(file) {
        return (file.match(/[.]/) === null);
      });

      lib.Content.Lesson.loadSummary(function(err, lessonGroups, lessons) {

        res.render('admin/content', { title: config.title, files: filteredFiles, lessonGroups: lessonGroups, lessons: lessons, cur_section: "content", page_title: "Content", bread_current: "Content" });
      
      });

    });
    
  });

  app.post('/admin/content/upload', lib.Utils.requireRole('admin'), function(req, res) {

    log.debug('reading temp path: ' + req.files.uploadFile.path);
    fs.readFile(req.files.uploadFile.path, function (err, data) {
      log.debug('data len = ' + data.length);
      var newPath = config.upload_dir + req.files.uploadFile.name;
      log.debug('writing new file: ' + newPath);
      fs.writeFile(newPath, data, function (err) {
        log.error(err, 'writing new file');
        log.green('done!');
        res.redirect("back");
      });
    });

  });

  // Content: Import ----------------------------
  app.get('/admin/content/import/:filename', function(req, res) {
    var file = config.upload_dir + req.params.filename;
    log.notice('processing file: ' + file);
    
    log.notice('loading file...');
    var raw_data = fs.readFileSync(file).toString();

    var reportProgress = function(value, msg, questions) {
      log.notice('importing: ' + value + '%');
    }

    log.notice('parsing + importing...');
    htmlImporter.processRawData(raw_data, lib, reportProgress, function() {
      log.success('import completed!');
      res.redirect("back");
    });

  });


  // Crons ----------------------------
  app.get('/admin/crons', lib.Utils.requireRole('admin'), function(req, res) {
    res.render('admin/crons', { title: config.title, cur_section: "crons", page_title: "Crons", bread_current: "Crons" });
  });



  // Partners ----------------------------
  app.get('/admin/partners', lib.Utils.requireRole('admin'), function(req, res) {
    res.render('admin/partners', { title: config.title, cur_section: "partners", page_title: "Partners", bread_current: "Partners" });
  });



}

var adminIo = function(socket) {
  return true;
}

module.exports.web = adminController;
module.exports.io  = adminIo;