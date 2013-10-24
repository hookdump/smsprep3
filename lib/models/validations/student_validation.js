var _ = require('underscore');

module.exports = function (data, method, callback) {
  var errors = [];
  var validation = {
    phone_regex: /^[189][0-9]{10}$/
    , zipcode_regex: /^[0-9]{5}$/
    , email_regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    , timezones_list: ['EST', 'MST', 'CST', 'PST', 'ART']
    , schedules_list: ['morning', 'afternoon', 'evening', 'night', 'test']
  }

  // Check mandatory fields --------------------------------
  if (method === 'start') {
    if (!data.phone)                      errors.push('you must specify the [phone] field when creating a student');
    if (!data.timezone && !data.zipcode)  errors.push('you must specify either the [timezone] or [zipcode] field when creating a student');
    if (!data.schedule)                   errors.push('you must specify the [schedule] field when creating a student');
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
    if (!(data.schedule instanceof Array)) {
      var scheduleArr = data.schedule.split("+");
    } else {
      scheduleArr = data.schedule;
    }
    
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
    if (!(data.lessons instanceof Array)) {
      var lessonsArr = data.lessons.split("+");
      data.lessons = lessonsArr;
    }
  }
  if (data.lessons === "") {
    log.info('no lessons, putting empty array here!');
    data.lessons = [];
  }

  log.warn('lessongroups=');
  log.warn(data.lessongroups);
  if (data.lessongroups) {
    if (!(data.lessongroups instanceof Array)) {
      var lessonGroupsArr = data.lessongroups.split("+");
      data.lessongroups = lessonGroupsArr;
      log.green(data.lessongroups);
    }
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