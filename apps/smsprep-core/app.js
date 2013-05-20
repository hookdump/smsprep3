/*
 * smsPREP 3
 * smsprep-core
 */

var express = require('express')
  , http = require('http')
  , app = express()
  , Lib = require('../../lib/wrapper')
  , bus = require('servicebus').bus({log: log.rabbit});

// Set app config variables
var appConfig = {
      name:   'smsprep-core'
    , port:   Lib.Config.services.core.port
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

// Subscribe to bus events
bus.subscribe('smsprep.sms.in', function (event) {
  log.info(event);
});

// Start server!
http.createServer(app).listen(app.get('port'), function() {
  var now = new Date();
  log.warn( "starting [" + Lib.Config.env + "] " + appConfig.name + " in port " + app.get('port') + " - " + now );
});
