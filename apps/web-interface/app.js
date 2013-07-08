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
    , title:  'smsPREP'
    , port: Lib.Config.services.web.port
    , upload_dir: __dirname + "/public/upload/"
    , logs: false
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
  Lib.User.findOne({ username: uname }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
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
  app.set('layout', 'nice_layout');
  app.use(express.favicon());

  if (appConfig.logs) {
    app.use(express.logger('dev'));
  }

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

    res.locals.error_flash = req.flash('error');
    res.locals.success_flash = req.flash('success');

    log.route(req.method, req.url);

    // current section
    var active_str = " class='active' ";
    res.locals.cur_home = ( req.url === '/' ) ? active_str : "";
    res.locals.cur_dashboard = ( req.url === '/dashboard' ) ? active_str : "";
    res.locals.cur_content = ( req.url === '/content' ) ? active_str : "";
    res.locals.cur_students = ( req.url === '/students' ) ? active_str : "";

    // user
    if (req.user) {
      res.locals.username = req.user.username;
      res.locals.loggedin = true;
    } else {
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