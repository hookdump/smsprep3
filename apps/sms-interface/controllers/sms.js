var _ = require('underscore');
var fs = require('fs');
var Step = require('step');
var slooceInterface = require('../modules/slooceInterface.js');

var smsController = function(app, config, lib) {
  log.loading('sms controller');

  slooceInterface.init(lib);

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to sms-interface v" + lib.Config.version, environment: lib.Config.env});
  });
  
  app.post('/slooce-connection', function(req, res) {
    slooceInterface.incomingMessage(req.rawBody);
    res.send(200);
  });

}

module.exports.web = smsController;
module.exports.io  = null;