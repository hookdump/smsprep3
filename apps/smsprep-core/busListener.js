var myself = {
	init: function(Lib) {

		log.loading('bus listener');

		// Subscribe to bus events
		Lib.Bus.subscribe('smsprep.sms.in', function (event) {
		  
			// Find student

			// Check if student is active

			// Check if student has an active question

		});

	}
};
module.exports = myself;