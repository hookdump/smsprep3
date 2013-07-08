var _  = require('underscore');

exports.init = function(app, config, lib) {

  var Api   = require('./modules/api');
  Api.init(lib);

  // Root placeholder
  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to api-interface v" + lib.Config.version, environment: lib.Config.env});
  });

  // Student start
  app.post('/:partner/:uid/start', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.start( findQuery, req.body, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student edit
  app.post('/:partner/:uid/edit', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.edit( findQuery, req.body, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student activate
  app.post('/:partner/:uid/activate', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.activate( findQuery, function(err, sendBack) {
      res.json(sendBack);
    });
  
  });

  // Student deactivate
  app.post('/:partner/:uid/deactivate', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.deactivate( findQuery, function(err, sendBack) {
      res.json(sendBack);
    });
 
  });

  // Student status check
  app.get('/:partner/:uid/status', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.status( findQuery, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Student reconfirmation
  app.post('/:partner/:uid/reconfirmation', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    Api.Student.reconfirm( findQuery, function(err, sendBack) {
      res.json(sendBack);
    });

  });

  // Custom message
  app.post('/:partner/:uid/send', function(req, res) {
    var findQuery = lib.Utils.buildFindQuery( req.params );
    var msg = req.body.message;
    Api.Student.sendMessage( findQuery, msg, function(err, sendBack) {
      res.json(sendBack);
    });

  });

}