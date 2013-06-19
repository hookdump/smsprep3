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

			Core.receiveMessage(myPhone, myMessage, function(err, response) {
				log.highlight('sms', 'delivering response for [' + myPhone + ': Payload (' + response.length + ')]');
				Lib.Bus.publish('sms.out', {payload: response});
			});

		});

	}
};
module.exports = myself;