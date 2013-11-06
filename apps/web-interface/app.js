/*
 * smsPREP 3
 * web-interface
 */

var express         = require('express')
  , http            = require('http')
  , app             = express()
  , compass         = require('node-compass')
  , expressLayouts  = require('express-ejs-layouts')
  , flash           = require('connect-flash')
  , passport        = require('passport')
  , LocalStrategy   = require('passport-local').Strategy
  , Lib             = require('../../lib/wrapper')
  , io              = require('socket.io');

// Set app config variables
var appConfig = {
      name:   'web-interface'
    , title:  Lib.Config.name
    , port:   Lib.Config.services.web.port
    , upload_dir: __dirname + "/public/upload/"
    , logs: true
};
log.info('starting ' + appConfig.name + ' @ ' + Lib.Config.env + '');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Lib.User.findOne({_id: id}, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy( function(uname, pass, done) {
  log.debug('Finding user...');
  Lib.User.findOne({ username: uname }, function(err, user) {
    log.debug('Found user!');
    if (err) { 
      log.debug('Error authenticating user!');
      log.warn(err);
      return done(err); 
    }
    if (!user) { 
      log.debug('Could not find user!');
      return done(null, false, { message: 'Incorrect username.' }); 
    }
    if (!user.validPassword(pass)) { return done(null, false, { message: 'Incorrect password.' }); }

    log.success('user ' + user.username + ' authenticated!');
    return done(null, user);
    });
}));

// Init Express app configuration
app.configure(function(){
  app.set('port', appConfig.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'admin_layout');
  app.use(express.favicon());

  /*
  if (appConfig.logs) {
    var logger = express.logger('dev');

    app.use(function(req, res, next) {
      if (/^\/admin\/messages\/load/.test(req.url)) return logger(req, res, next);
      next();
    });

    // app.use(express.logger('dev'));
  }
  */

  app.use(express.bodyParser());
  app.use(express.methodOverride()); 
  app.use(express.cookieParser('huff and puff'));
  app.use(express.session({ secret: 'lalala', cookie: { secure: false, maxAge: 86400000 }}));
  app.use(flash());
  app.use(expressLayouts);
  app.use(compass());

  // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use('/public', express.static(__dirname + '/public'));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function (req, res, next) {
    if ('HEAD' == req.method || 'OPTIONS' == req.method) return next();

    // break session hash / force express to spit out a new cookie once per second at most
    req.session._garbage = Date();
    req.session.touch();
    next();
  });

  app.use(function(req, res, next){

    res.locals.error_flash = req.flash('error') || null;
    res.locals.success_flash = req.flash('success') || null;

    log.route(req.method, req.url);

    // current section
    var active_str = " current ";
    res.locals.cur_home = ( req.url === '/' ) ? active_str : "";
    res.locals.cur_admin = ( req.url === '/admin' ) ? active_str : "";
    res.locals.cur_messages = ( req.url === '/admin/messages' ) ? active_str : "";
    res.locals.cur_students = ( req.url === '/admin/students' ) ? active_str : "";
    res.locals.cur_content = ( req.url === '/admin/content' ) ? active_str : "";
    res.locals.cur_partners = ( req.url === '/admin/partners' ) ? active_str : "";
    res.locals.cur_crons = ( req.url === '/admin/crons' ) ? active_str : "";
    

    // user
    if (req.user) {
      log.gray('# logged in as: ' + req.user.username );
      res.locals.username = req.user.username;
      res.locals.loggedin = true;
    } else {
      log.gray('# not logged in');
      res.locals.loggedin = false;
    }

    next();
  });


  app.use(app.router);
});

// Set up error handling
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Start web server!
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  var now = new Date();
  log.info( "starting server in port " + app.get('port') + " - " + now );
});

// Start io server!
var ioServer = io.listen(server, {log: false});

// Optimize Socket.IO for production
if (Lib.Config.env === 'production') {
  ioServer.configure('production', function() {
    log.info('configuring IO server for production...')
    ioServer.enable('browser client minification');  // send minified client
    ioServer.enable('browser client etag');          // apply etag caching logic based on version number
    ioServer.enable('browser client gzip');          // gzip the file
    ioServer.set('log level', 1);                    // reduce logging
    ioServer.set('transports', [                     // enable all transports (optional if you want flashsocket)
        'websocket'
      , 'flashsocket'
      , 'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
    ]);
  });
}

ioServer.sockets.on('connection', function(socket) {
  router.initSocket(socket, appConfig, Lib);
});

// Listen to bus events
var busListener = require('./busListener');
busListener.init(Lib);

// Load routes
var router = require('./routes');
router.init(app, appConfig, Lib, passport);