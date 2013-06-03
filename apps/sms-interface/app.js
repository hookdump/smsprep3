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
log.info('starting ' + appConfig.name + ' @ ' + Lib.Config.env + '');

// Init Express app configuration
app.configure(function(){
  app.set('port', appConfig.port);
  app.use(express.logger('dev'));
  app.use(express.methodOverride());  

  // Allow getting XML data
  app.use(function(req, res, next) {
      var data = '';
      // req.setEncoding('utf8');
      req.on('data', function(chunk) { 
        data += chunk;
      });
      req.on('end', function() {
        req.rawBody = data;
        next();
      });
  });

  app.use(express.bodyParser());  // Run this AFTER the XML middleware!

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
