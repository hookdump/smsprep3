exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({hello: true});
  });

  app.get('/msg/:phone/:message', function(req, res) {
    var phone = req.params.phone;
    var msg = req.params.message;

    console.log("Incoming message from " + phone + ": " + msg);
    lib.User.findOne({ phone: phone }, function(err, user) {
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

}