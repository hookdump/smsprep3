var User = require('../../lib/models/user');
var Core = require('./modules/core');

exports.init = function(app, config, lib) {

  Core.init(lib);

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsprep-core v" + lib.Config.version, environment: lib.Config.env});
  });

  app.get('/msg/:phone/:message', function(req, res) {
    var phone = req.params.phone;
    var msg = req.params.message;

    Core.receiveMessage(phone, msg, function(err, response) {
      // Lib.Bus.publish('sms.out', {payload: response});

      log.warn('------------------------------------------');
      log.info("emulating response to " + phone);
      log.info(response);
      res.json({success: true, payload: response});
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
