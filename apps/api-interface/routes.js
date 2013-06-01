var _ = require('underscore');

exports.init = function(app, config, lib) {

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v" + config.version, environment: lib.Config.env});
  });

  // Student start
  app.post('/:partner/:uid/start', function(req, res) {

    lib.Student.upsertStudent( req.params.uid , req.body , 'start', function(err, updatedStudent) {
      log.error('upserting student', err);

      var sendBack = {success: true};
      if (err) {
        sendBack['success'] = false;
        sendBack['errors'] = err.errors;
      } else {
        sendBack['studentId'] = updatedStudent._id;
      }

      res.json(sendBack);
    });

  });

  // Student edit
  app.post('/:partner/:uid/edit', function(req, res) {

    lib.Student.upsertStudent( req.params.uid , req.body , 'edit', function(err, updatedStudent) {
      log.error('upserting student', err);

      var sendBack = {success: true};
      if (err) {
        sendBack['success'] = false;
        sendBack['errors'] = err.errors;
      } else {
        sendBack['studentId'] = updatedStudent._id;
      }

      res.json(sendBack);
    });

  });

  var changeActive = function(uid, activate, cb) {
    lib.Student.activateStudent( uid , activate , function(err, affected) {
      log.error('activating student', err);

      var sendBack = {success: true};
      if (affected === 0) {
        sendBack['success'] = false;
        sendBack['errors'] = ['the student ' + uid + ' does not exist in our database!']; 
      }
      if (err) {
        sendBack['success'] = false;
        sendBack['errors'] = ['database error while activating student'];
      }

      return cb(sendBack);
    });
  }

  // Student activate
  app.post('/:partner/:uid/activate', function(req, res) {
    changeActive(req.params.uid, true, function(response) {
      res.json(response);
    })    
  });

  // Student deactivate
  app.post('/:partner/:uid/deactivate', function(req, res) {
    changeActive(req.params.uid, false, function(response) {
      res.json(response);
    })    
  });

  // Student status check
  app.get('/:partner/:uid/status', function(req, res) {

    var sendBack = {success: true};

    lib.Student.loadData( req.params.uid, function(err, myStudent) {

      if (myStudent) {

        var retStatus = {
          studentId: myStudent._id
          , active: myStudent.active || 'true'
          , externalId: myStudent.externalId
          , confirmed: myStudent.confirmed || 'false'
          , created: myStudent.joined
          , schedule: myStudent.schedule
          , lessons: myStudent.lessons
          , lessongroups: myStudent.lessongroups
          , stats: {
            totalAnswers: 0
            , correctAnswers: 0
          }
        };
        sendBack['status'] = retStatus;

      } else {

        sendBack['success'] = false;
        sendBack['errors'] = ['the student ' + req.params.uid + ' does not exist in our database!']; 

      }

      res.json(sendBack);

    });
  });

  // Student reconfirmation
  app.post('/:partner/:uid/reconfirmation', function(req, res) {
    res.json({success: true});
  });

  // Custom message
  app.post('/:partner/:uid/send', function(req, res) {
    res.json({success: true});
  });

}