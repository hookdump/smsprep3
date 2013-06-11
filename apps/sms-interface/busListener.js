var slooceInterface = require('./modules/slooceInterface');

var myself = {
	init: function(Lib) {

		log.loading('bus listener');

		// Subscribe to bus events
		Lib.Bus.subscribe('sms.out', function (event) {
			var payload = event.data.payload;

			// Transform payload to Array
			if (!(payload instanceof Array)) {
				payload = [payload];
			}

			var toPhone = event.data.to;
			var message	= event.data.message;
			slooceInterface.sendMessage(toPhone, message);
		});

	}
};
module.exports = myself;