/*
 * smsPREP 3
 * api-interface
 */

var express = require('express')
  , http = require('http')
  , app = express()
  , Lib = require('../../lib/wrapper');

// Set app config variables
var appConfig = {
      name:   'sms-interface'
    , port:   Lib.Config.services.sms.port
};

// Init Express app configuration
app.configure(function(){
  app.set('port', appConfig.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());  
  app.use(app.router);
});

// Set up error handling
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Load routes
var router = require('./routes');
router.init(app, appConfig, Lib);

// Start server!
http.createServer(app).listen(app.get('port'), function() {
  var now = new Date();
  log.warn( "starting " + appConfig.name + " in port " + app.get('port') + " - " + now );
});
