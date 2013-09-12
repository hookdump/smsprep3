var Checks = {
	Lib: null
};

var _       	= require('underscore');
var Step    	= require('step');

Checks.init = function(lib) {
	log.green('initializing core checks lib...');
	this.Lib	= lib;
};

// Checks standard callback is:
// function(err, newMsg, abort, addPayload)

// Payload formats is:
// [{phone: 12223334444, message: 'testing'}, {delay: 1000}]

Checks.isActive = function(student, msg, callback) {
	var self = this;

	if (!student.active) {

		// Student is inactive.
		self.Lib.Utils.reportError('processMessage', 'message received (' + msg + ') from an inactive student (' + student._id + ')');
		return callback(null, msg, true);

	} else {

		// Student is active.
		return callback(null, msg, false);

	}

}

Checks.isConfirmed = function(student, msg, callback) {
	var self = this;

	if (!student.confirmed || msg === 'CONFIRM') {

		if (msg === 'CONFIRM') {

			// 1. Confirm student.
			log.info('confirming student...');
			student.confirm(function(err) {

				// 2. Build response.
				var payload1 = {phone: student.phone, message: 'Your phone number has been confirmed! You\'ll be getting your first question in a few seconds...'};
				var payload2 = {delay: 5000};

				// 3. Add payload, change message to N, and return control to main handler
				return callback(null, 'N', false, [payload1, payload2]);
			});

		} else {

			// Unconfirmed user sent invalid message.
			self.Lib.Utils.reportError('processMessage', 'message received (' + msg + ') from an unconfirmed student (' + student._id + ')');

			// Interrupt flow
			// Keep message intact, abort.
			return callback(null, msg, true);
		}

	} else {

		// Student is confirmed.
		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}

}

module.exports = Checks;