var slooceInterface = require('./modules/slooceInterface');

var myself = {
	init: function(Lib) {

		log.loading('bus listener');

		// Subscribe to bus events
		Lib.Bus.subscribe('smsprep.sms.out', function (event) {		
			log.debug('sms out!');
			lob.info( event );

			slooceInterface.noop();
		});

	}
};
module.exports = myself;