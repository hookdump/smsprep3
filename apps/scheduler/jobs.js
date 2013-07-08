var cronJob = require('cron').CronJob;
var _ 		= require('underscore');
var moment	= require('moment');

var timezones_list = ['EST', 'MST', 'CST', 'PST'];
var schedules_list = ['morning', 'afternoon', 'evening', 'night'];
var jobs = {};

var timezoneMapping = {
	'America/Argentina/Buenos_Aires': 'ART'	// -3
	, 'US/Pacific': 'PST'	// -8
	, 'US/Mountain': 'MST'	// -7
	, 'US/Central': 'CST'	// -6
	, 'US/Eastern': 'EST'	// -5
	
};

var scheduleMapping = {
	'15 10': 'morning'		// 10:15
	, '10 14': 'afternoon'	// 14:10
	, '05 17': 'evening'	// 17:05
	, '00 20': 'night'		// 20:00
};

jobs.init = function(lib) {
	log.loading('scheduled jobs');
	jobs.Lib = lib;
	jobs.stack = [];

	_.each(timezoneMapping, function(tzName, curTimezone) {
		_.each(scheduleMapping, function(scheduleName, curSchedule) {

			var tmp = jobs.buildJob(curTimezone, curSchedule);
			jobs.stack.push(tmp);

		});
	});

	var tmp = jobs.buildTestJob();
	jobs.stack.push(tmp);

	log.success('jobs scheduled successfully!');
};

jobs.buildJob = function(tz, time) {
	var tzName = timezoneMapping[tz];
	var scheduleName = scheduleMapping[time];
	log.cyan('creating cron job for ' + tzName + ' > ' + scheduleName);

	var tmp = new cronJob({
		cronTime: '00 ' + time + ' * * *',
		onTick: function() {
			log.cyan('running cron job for ' + tzName + ' > ' + scheduleName);
			jobs.Lib.Bus.publish('cron.question', {timezone: tzName, schedule: scheduleName});
		},
		start: true,
		timeZone: tz
	});
	return tmp;
}

jobs.buildTestJob = function() {
	var tz = 'America/Argentina/Buenos_Aires';
	var tzName = 'ART'
	var scheduleName = 'test';
	var soon = moment().add('seconds', 6).toDate();
	log.blue('creating test cron job for ' + tzName + ' > ' + scheduleName);

	var tmp = new cronJob({
		cronTime: soon,
		onTick: function() {
			log.blue('running test cron job for ' + tzName + ' > ' + scheduleName);
			jobs.Lib.Bus.publish('cron.question', {timezone: tzName, schedule: scheduleName});
		},
		start: true,
		timeZone: tz
	});
	return tmp;
}

jobs.mapTimes = function() {

}


module.exports = jobs;