var Core = require('./modules/core');

var myself = {
	init: function(Lib) {

		log.loading('bus listener');
		Core.init(Lib);

		// Subscribe to bus events
		Lib.Bus.subscribe('smsprep.sms.in', function (event) {

			var myPhone 	= event.data.phone;
			var myMessage 	= event.data.msg;

			Core.incomingMessage(myPhone, myMessage);

		});

	}
};
module.exports = myself;