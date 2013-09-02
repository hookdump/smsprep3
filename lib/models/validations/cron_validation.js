var _ = require('underscore');

module.exports = function (data, method, callback) {
  var errors = [];
  var validation = {
    timezones_list: ['EST', 'MST', 'CST', 'PST', 'ART']
    , schedules_list: ['morning', 'afternoon', 'evening', 'night', 'test']
  }

  // Check mandatory fields --------------------------------
  if (method === 'create') {
    if (!data.timezone)  errors.push('you must specify either the [timezone] or [zipcode] field when creating a student');
    if (!data.schedule)  errors.push('you must specify the [schedule] field');
  }

  if (data.timezone) {
    if (validation.timezones_list.indexOf(data.timezone) === -1) {
      errors.push('the [timezone] provided (' + data.timezone + ') is invalid! it must be one of these: [EST, MST, CST, PST]');
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

  var result = {
    success: (errors.length === 0)
    , error_messages: errors
  };
  callback(null, data, result);
}