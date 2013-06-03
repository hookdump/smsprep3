var slooceInterface = require('./modules/slooceInterface');

var myself = {
	init: function(Lib) {

		log.loading('bus listener');

		// Subscribe to bus events
		Lib.Bus.subscribe('smsprep.sms.out', function (event) {
			var toPhone = event.data.to;
			var message	= event.data.message;
			slooceInterface.sendMessage(toPhone, message);
		});

	}
};
module.exports = myself;