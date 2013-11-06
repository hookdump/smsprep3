var request = require('request');

var usersController = function(app, config, lib, passport) {
  log.loading('users controllers');

  // Main site ----------------------------
  app.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/admin');
    } else {
      // res.render('index', { title: config.title, cur_section: "index" });
      console.log( 'success - ' + req.query.success );
      res.render('landing', { layout: 'clean_layout', title: lib.Config.name, cur_section: 'landing' });
    }
  });

  // Landing signup -------------------
  app.post('/landing/signup', function(req,res) {
    var phone = req.body.phonenumber;

    // Create user
    var myUrl     = 'http://api.smsprep.com/smsprep/' + phone + '/start'; 
    var myBody    = {
      
    };

    request.post('http://service.com/upload', myBody, function() {

    });

    res.redirect('/?success=1');
  });

  // Login ----------------------------
  app.get('/login', function(req, res) {
    res.render('login', { layout: 'empty_layout', title: config.title });
  });
  app.post('/login',
    passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login', failureFlash: true } )
  );

  // Logout ----------------------------
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // Sign up ----------------------------
  app.get('/join', function(req, res) {
    res.render('join', { title: config.title });
  });
  app.post('/join', function(req, res) {
    lib.User.createUser( req.body.username, req.body.password, function(err, u, msg) {
      if (err || !u) {
        req.flash('error', msg.error);
        res.redirect('/?err=1');
      } else {
        req.flash('success', msg.success);
        res.redirect('/');
      }
    });
  });

}

var usersIo = function(socket) {
  return true;
}

module.exports.web = usersController;
module.exports.io  = usersIo;