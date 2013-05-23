exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v2.1"});
  });

  // Student start
  app.get('/:partner/:uid/start', function(req, res) {
    res.json({success: true, queryReceived: req.query});
  });

  // Student edit
  app.get('/:partner/:uid/edit', function(req, res) {
    res.json({success: true, queryReceived: req.query});
  });

  // Student activate
  app.get('/:partner/:uid/activate', function(req, res) {
    res.json({success: true, queryReceived: req.query});
  });

  // Student deactivate
  app.get('/:partner/:uid/deactivate', function(req, res) {
    res.json({success: true, queryReceived: req.query});
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
    res.json({success: true, queryReceived: req.query});
  });

  // Custom message
  app.get('/:partner/:uid/send', function(req, res) {
    res.json({success: true, queryReceived: req.query});
  });

}