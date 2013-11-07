var slooceInterface = require('./modules/slooceInterface');

var myself = {
	init: function(Lib) {
		log.loading('bus listener');

		// slooceInterface
		slooceInterface.init(Lib);

		// Subscribe to bus events
		Lib.Bus.subscribe('sms.out', function (event) {
			var payload = event.data.payload;
			var test = false;
			if (event.data['test']) test = true;

			// Transform payload to Array
			if (!(payload instanceof Array)) {
				payload = [payload];
			}

			slooceInterface.sendMessages(payload, test);
		});

		// Subscribe to bus events
		Lib.Bus.subscribe('phone.init', function (event) {
			var phone = event.data.phone;
			var test = false;
			if (event.data['test']) test = true;

			slooceInterface.initializePhone(phone, function(err) {
				log.error('triggering phone initialization for #' + phone, err);

				if (!err) {
					log.success('phone initialization triggered!');
				}
			});
		});

	}
};
module.exports = myself;