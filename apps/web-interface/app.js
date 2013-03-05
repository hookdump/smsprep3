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
  , log_colors      = require('../../lib/log_colors')
  , io              = require('socket.io');

// Set app config variables
var appConfig = {
      name:   'web-interface'
    , title:  'smsPREP'
    , port: 8080
    , upload_dir: __dirname + "/public/upload/"
    , logs: false
};

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
  app.use(express.session({ cookie: { secure: false, maxAge: 86400000 }}));
  app.use(flash());
  app.use(expressLayouts);
  app.use(compass());

  // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use('/public', express.static(__dirname + '/public'));

  app.use(passport.initialize());
  app.use(passport.session());

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
  log.warn( appConfig.name + " listening to " + app.get('port') );
});

// Start io server!
var ioServer = io.listen(server, {log: false});
ioServer.sockets.on('connection', function(socket) {
  router.initSocket(socket, appConfig, Lib);
});

// Load routes
var router = require('./routes');
router.init(app, appConfig, Lib, passport);