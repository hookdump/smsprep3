var User = require('../lib/models/user');

exports.init = function(app, config, passport) {

  app.get('/', function(req, res) {

    if (req.user) {

      res.redirect('/dashboard');

    } else {
      // GUEST!
      User.countUsers( function(err, count) {
        if (err) {
          count = "???";
        }
        res.render('index', { title: config.title, cur_section: "index", userCount: count });
      });

    }

  });

  app.get('/login', function(req, res) {
    res.render('login', { title: config.title });
  });

  app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true } )
  );

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/join', function(req, res) {
    res.render('join', { title: config.title });
  });

  app.post('/join', function(req, res) {
    User.createUser( req.body.username, req.body.password, function(err, u, msg) {
      if (err || !u) {
        req.flash('error', msg.error);
        res.redirect('/?err=1');
      } else {
        req.flash('success', msg.success);
        res.redirect('/');
      }
    });
  });

  app.get('/dashboard', function(req, res) {
    if (!req.user) {
      res.redirect('/');
    } else {
        console.log("LOADING DASHBOARD");
        var info = {};
        User.getCurrentStreak(req.user.id, function(err, data) {
          info.curStreak = data;
          res.render('dashboard', { title: config.title, cur_section: "dashboard", info: info });  
        });
    }
  });

  app.get('/msg/:phone/:message', function(req, res) {
    var phone = req.params.phone;
    var msg = req.params.message;

    console.log("Incoming message from " + phone + ": " + msg);
    User.findOne({ phone: phone }, function(err, user) {
      if (err) {
        console.log("ERR:");
        console.log(err);
        res.json({success: false, error: err.toString()});
      } else {
        if (user) {
          res.json({success: true});
        } else {
          res.json({success: false, error: "User " + phone + " does not exist!"});
        }
      }
      
    });
    
  });

  app.get('/api/start/:phone', function(req, res) {
    var phone = req.params.phone;
    console.log("Creating user " + phone + "...");
    
    User.createUser( phone, function(err, u) {
      if (err || !u) {
        res.json({success: false, error: "Error while creating user " + phone});
      } else {
        res.json({success: true})
      }
    });
    
  });



}
