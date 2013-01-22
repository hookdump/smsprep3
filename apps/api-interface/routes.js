exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({hello: true});
  });

  app.get('/msg/:phone/:message', function(req, res) {
    var phone = req.params.phone;
    var msg = req.params.message;

    console.log("Incoming message from student " + phone + ": " + msg);
    lib.Student.findOne({ phone: phone }, function(err, student) {
      if (err) {
        console.log("ERR:");
        console.log(err);
        res.json({success: false, error: err.toString()});
      } else {
        if (student) {
          res.json({success: true});
        } else {
          res.json({success: false, error: "Student " + phone + " does not exist!"});
        }
      }
      
    });
  });

}