var Core = {
	config: null
	, lib: null
};

var _       	= require('underscore');
var Step    	= require('step');

Core.init = function(lib) {
	this.Lib	= lib;
};

Core.noop = function() {
	log.info('core noop');
};

Core.incomingMessage = function(phone, message) {
	// Find student
	Core.Lib.Student.findOne({ phone: phone }, function(err, student) {
		if (err) {
			log.error('loading student #' + phone, err);
		} else {
			var msgSummary = ' [' + phone + ': ' + message + ']';
			if (student) {
				log.highlight('sms', 'incoming message from student ' + student._id + msgSummary);
			} else {
				log.highlightRed('sms', 'incoming message from unknown number' + msgSummary);
			}
		}  
	});

	// Check if student is active

	// Check if student has an active question
}

module.exports = Core;