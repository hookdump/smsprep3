exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v2.1"});
  });

  // Student start
  app.get('/:partner/:uid/start', function(req, res) {
    res.json({success: true});
  });

  // Student edit
  app.get('/:partner/:uid/edit', function(req, res) {
    res.json({success: true});
  });

  // Student activate
  app.get('/:partner/:uid/activate', function(req, res) {
    res.json({success: true});
  });

  // Student deactivate
  app.get('/:partner/:uid/deactivate', function(req, res) {
    res.json({success: true});
  });

  // Student status check
  app.get('/:partner/:uid/status', function(req, res) {
    var retStatus = {
      studentId: 'ID'
      , confirmed: false
      , created: 'stamp'
      , stats: {
        placeholder: true   
      }
    };
    res.json({success: true, status: retStatus});
  });

  // Student reconfirmation
  app.get('/:partner/:uid/reconfirmation', function(req, res) {
    res.json({success: true});
  });

  // Custom message
  app.get('/:partner/:uid/send', function(req, res) {
    res.json({success: true, messageToSend: req.query["message"]});
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