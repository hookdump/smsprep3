var User = require('../../lib/models/user');

exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP Core Module", environment: lib.Config.env});
  });

  app.get('/msg/:phone/:message', function(req, res) {
    var phone = req.params.phone;
    var msg = req.params.message;

    log.info("incoming message from " + phone + ": " + msg);

    lib.Student.findOne({ phone: phone }, function(err, student) {
      if (err) {
        log.error('loading student #' + phone, err);
        res.json({success: false, error: err.toString()});
      } else {
        if (student) {
          lib.Bus.publish('smsprep.sms.in', {phone: phone, msg: msg});
          res.json({success: true});
        } else {
          res.json({success: false, error: "Student #" + phone + " does not exist!"});
        }
      }  
    });
  });

  app.get('/api/start/:phone', function(req, res) {
    var phone = req.params.phone;
    console.log("Creating user " + phone + "...");
    
    User.createUser( phone, function(err, u) {
      if (err || !u) {
        res.json({success: false, error: "Error while creating user " + phone});
      } else {
        res.json({success: true})
      }
    });
    
  });



}
