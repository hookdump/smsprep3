var requestJSON = require('request-json');

var usersController = function(app, config, lib, passport) {
  log.loading('users controllers');

  // Main site ----------------------------
  app.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/admin');
    } else {
      // res.render('index', { title: config.title, cur_section: "index" });
      var allowedFirstDigit = (lib.Config.env != 'production') ? '[19]' : '[1]';
      res.render('landing', { layout: 'clean_layout', title: lib.Config.name, cur_section: 'landing', allowed_first_digit: allowedFirstDigit });
    }
  });

  // Landing signup -------------------
  app.post('/landing/signup', function(req,res) {
    var phone = req.body.phonenumber;
    var course = req.body.course;
    var schedule = req.body.schedule;
    var timezone = req.body.timezone;

    console.log(phone + ' - ' + course + ' - ' + schedule + ' - ' + timezone);

    var apiRoute = lib.Config.services['api']['domain'];
    var myUrl     = 'http://' + apiRoute + '/'; 
    var myUrlParams = 'smsprep/' + phone + '/start';

    var groups = '';
    if (course == 'SAT') {
      var groups = 'SAT_MATH+SAT_READING+SAT_WRITING+';
    }
    if (course == 'ACT') {
      var groups = 'ACT_READING+ACT_ENGLISH+ACT_MATH';
    }

    var myBody    = {
      phone: phone,
      lessongroups: groups,
      timezone: timezone,
      schedule: schedule
    };
    myBody2 = JSON.stringify(myBody);

    console.log('requesting...');
    var requestClient = requestJSON.newClient(myUrl);
    requestClient.post(myUrlParams, myBody, function(err2, res2, body2) {
      console.log(res.statusCode);
      res.redirect('/?success=1');  
    });
    
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