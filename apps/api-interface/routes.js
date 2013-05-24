var _ = require('underscore');

exports.init = function(app, config, lib) {

  var validateUserData = function(data, method, callback) {
    var errors = [];
    var validation = {
      phone_regex: /^[19][0-9]{10}$/
      , zipcode_regex: /^[0-9]{5}$/
      , email_regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      , timezones_list: ['EST', 'MST', 'CST', 'PST']
      , schedules_list: ['morning', 'afternoon', 'evening', 'night']
    }

    // Check mandatory fields
    if (method === 'start') {
      if (!data.phone) {
        errors.push('you must specify the [phone] field when creating a student');
      }

      if (!data.timezone && !data.zipcode) {
        errors.push('you must specify either the [timezone] or [zipcode] field when creating a student');
      }

      if (!data.schedule) {
        errors.push('you must specify the [schedule] field when creating a student');
      }
    }

    // Validate arguments
    if (data.phone) {
      if (!data.phone.match(validation.phone_regex)) {
        errors.push('the [phone] provided (' + data.phone + ') is invalid! it must be a 11-digit number, starting with 1');
      }
    }

    if (data.timezone) {
      if (validation.timezones_list.indexOf(data.timezone) === -1) {
        errors.push('the [timezone] provided (' + data.timezone + ') is invalid! it must be one of these: [EST, MST, CST, PST]');
      }
    }

    if (data.zipcode) {
      if (!data.zipcode.match(validation.zipcode_regex)) {
        errors.push('the [zipcode] provided (' + data.zipcode + ') is invalid! it must be a 5-digit number');
      }
    }

    if (data.schedule) {
      var scheduleArr = data.schedule.split("+");
      var validSchedules = _.every(scheduleArr, function(el) {
        return (validation.schedules_list.indexOf(el) !== -1);
      });
      if (!validSchedules) {
        errors.push('the [schedule] provided (' + data.schedule + ') is invalid! it must be one of these: [morning, afternoon, evening, night] or a combination of them');
      } else {
        data.schedule = scheduleArr;
      }
    }

    if (data.email) {
      if (!data.email.match(validation.email_regex)) {
        errors.push('the [email] provided (' + data.email + ') is invalid!');
      }
    }

    if (data.lessons) {
      var lessonsArr = data.lessons.split("+");
      data.lessons = lessonsArr;
    }
    if (data.lessons === "") {
      log.info('no lessons, putting empty array here!');
      data.lessons = [];
    }

    if (data.lessongroups) {
      var lessonGroupsArr = data.lessongroups.split("+");
      data.lessongroups = lessonGroupsArr;
    }
    if (data.lessongroups === "") {
      log.info('no lessongroups, putting empty array here!');
      data.lessongroups = [];
    }


    var result = {
      success: (errors.length === 0)
      , error_messages: errors
    };
    callback(null, data, result);
  }

  app.get('/', function(req, res) {
    res.json({success: true, message: "Welcome to smsPREP API v2.1"});
  });

  // Student start
  app.post('/:partner/:uid/start', function(req, res) {
    var rawData = req.body;
    validateUserData(rawData, 'start', function(err, studentData, result) {

      studentData.joined = Date.now();
      log.info('joined = ' + studentData.joined);

      if (result.success) {    
        lib.Student.upsertStudent( req.params.uid , studentData , function(err, loadedStudent) {
          log.error('upserting student', err);

          var sendBack = {success: true};
          if (err) {
            sendBack['success'] = false;
            sendBack['errors'] = 'error saving student to database';
          } else {
            sendBack['studentId'] = loadedStudent._id;
          }

          res.json(sendBack);
        });
      } else {
        res.json({success: result.success, errors: result.error_messages});
      }
      
    });
  });

  // Student edit
  app.post('/:partner/:uid/edit', function(req, res) {
    var rawData = req.body;
    validateUserData(rawData, 'edit', function(err, studentData, result) {

      if (result.success) {

        log.info('updating...');
        log.info( studentData );

        lib.Student.upsertStudent( req.params.uid , studentData , function(err, loadedStudent) {
          log.error('upserting student', err);

          var sendBack = {success: true};
          if (err) {
            sendBack['success'] = false;
            sendBack['errors'] = 'error saving student to database';
          } else {
            sendBack['studentId'] = loadedStudent._id;
          }

          res.json(sendBack);
        });
      } else {
        res.json({success: result.success, errors: result.error_messages});
      }
      
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