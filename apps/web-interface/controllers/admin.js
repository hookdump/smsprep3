var Core = require('../../smsprep-core/modules/core');

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
    res.render('admin/content', { title: config.title, cur_section: "content", page_title: "Content", bread_current: "Content" });
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