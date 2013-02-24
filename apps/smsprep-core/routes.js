var User = require('../../lib/models/user');

exports.init = function(app, config, passport) {

  app.get('/', function(req, res) {
    res.json({success: true});
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
