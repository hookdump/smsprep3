/*
 * smsPREP 3
 * smsprep-core
 */

var express = require('express')
  , http = require('http')
  , app = express()
  , Lib = require('../../lib/wrapper');

// Set app config variables
var appConfig = {
      name:   'smsprep-core'
    , port:   Lib.Config.services.core.port
};
log.info('starting ' + appConfig.name + ' @ ' + Lib.Config.env + '');

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

// Listen to bus events
var busListener = require('./busListener');
busListener.init(Lib);

// Start server!
http.createServer(app).listen(app.get('port'), function() {
  var now = new Date();
  log.info( "starting server in port " + app.get('port') + " - " + now );
});
