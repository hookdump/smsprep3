exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v2.1"});
  });

  // Student start
  app.post('/:partner/:uid/start', function(req, res) {
    res.json({success: true, queryReceived: req.body});
  });

  // Student edit
  app.post('/:partner/:uid/edit', function(req, res) {
    res.json({success: true, queryReceived: req.body});
  });

  // Student activate
  app.post('/:partner/:uid/activate', function(req, res) {
    res.json({success: true, queryReceived: req.body});
  });

  // Student deactivate
  app.post('/:partner/:uid/deactivate', function(req, res) {
    res.json({success: true, queryReceived: req.body});
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
  app.post('/:partner/:uid/reconfirmation', function(req, res) {
    res.json({success: true, queryReceived: req.body});
  });

  // Custom message
  app.post('/:partner/:uid/send', function(req, res) {
    res.json({success: true, queryReceived: req.body});
  });

}