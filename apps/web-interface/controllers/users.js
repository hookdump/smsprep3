var usersController = function(app, config, lib, passport) {
  console.log('loading users controller...');

  // Main site ----------------------------
  app.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/dashboard');
    } else {
      res.render('index', { title: config.title, cur_section: "index" });
    }
  });

  // Login ----------------------------
  app.get('/login', function(req, res) {
    res.render('login', { title: config.title });
  });
  app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true } )
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

module.exports = usersController;