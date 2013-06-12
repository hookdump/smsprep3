var _  = require('underscore');

exports.init = function(app, config, lib) {

  var Api   = require('./modules/api');
  Api.init(lib);

  // Root placeholder
  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v" + config.version, environment: lib.Config.env});
  });

  // Student start
  app.post('/:partner/:uid/start', function(req, res) {

    Api.Student.start( req.params , req.body, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student edit
  app.post('/:partner/:uid/edit', function(req, res) {

    Api.Student.edit( req.params , req.body, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student activate
  app.post('/:partner/:uid/activate', function(req, res) {

    Api.Student.activate( req.params , function(err, sendBack) {
      res.json(sendBack);
    });
  
  });

  // Student deactivate
  app.post('/:partner/:uid/deactivate', function(req, res) {

    Api.Student.deactivate( req.params , function(err, sendBack) {
      res.json(sendBack);
    });
 
  });

  // Student status check
  app.get('/:partner/:uid/status', function(req, res) {

    Api.Student.status( req.params , function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student reconfirmation
  app.post('/:partner/:uid/reconfirmation', function(req, res) {

    Api.Student.reconfirm( req.params , function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Custom message
  app.post('/:partner/:uid/send', function(req, res) {
    var msg = req.body.message;
    Api.Student.sendMessage( req.params , msg, function(err, sendBack) {
      res.json(sendBack);
    });

  });

}