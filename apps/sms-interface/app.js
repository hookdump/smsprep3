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
    , port: 3000
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
http.createServer(app).listen(app.get('port'), function(){
  console.log(appConfig.name + " listening to " + app.get('port'));
});
