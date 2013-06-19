var slooceInterface = require('./modules/slooceInterface');

var myself = {
	init: function(Lib) {
		log.loading('bus listener');

		// slooceInterface
		slooceInterface.init(Lib);

		// Subscribe to bus events
		Lib.Bus.subscribe('sms.out', function (event) {
			var payload = event.data.payload;

			// Transform payload to Array
			if (!(payload instanceof Array)) {
				payload = [payload];
			}

			slooceInterface.sendMessages(payload);
		});

	}
};
module.exports = myself;