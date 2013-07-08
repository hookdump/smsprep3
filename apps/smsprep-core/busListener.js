var Core = require('./modules/core');

var myself = {
	init: function(Lib) {
		log.loading('bus listener');

		// Init Core module
		Core.init(Lib);

		// Subscribe to bus events
		Lib.Bus.subscribe('sms.in', function (event) {
			var myPhone 	= event.data.phone;
			var myMessage 	= event.data.msg;
			var myCommand 	= event.data.command;

			Core.receiveMessage(myPhone, myMessage, myCommand, function(err, response) {
				log.highlight('sms', 'delivering response for [' + myPhone + ': Payload (' + response.length + ')]');
				Lib.Bus.publish('sms.out', {payload: response});
			});

		});

		// Receive Crons
		Lib.Bus.subscribe('cron.question', function (event) {
			var myTz		= event.data.timezone;
			var mySchedule	= event.data.schedule;

			log.highlight('cron', 'processing delivery... (' + myTz + ' > ' + mySchedule + ')');
			Core.sendCronQuestion(myTz, mySchedule, function(err) {
				log.highlight('cron', 'delivery successful! (' + myTz + ' > ' + mySchedule + ')');
			});

		});

	}
};
module.exports = myself;