var _ = require('underscore');
var fs = require('fs');
var Step = require('step');

var smsController = function(app, config, lib) {
  log.loading('sms controller');

  app.get('/', function(req, res) {
    res.json({hello: true});
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

}

module.exports.web = smsController;
module.exports.io  = null;