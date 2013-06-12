var Core = {
	Lib: null
};

var _       	= require('underscore');
var Step    	= require('step');

Core.init = function(lib) {
	this.Lib	= lib;
};

Core.incomingMessage = function(phone, message, callback) {
	var self = this;

	// Find student
	self.Lib.Student.findOne({ phone: phone }, function(err, student) {
		if (err) {
			log.error('loading phone #' + phone, err);
			self.Lib.Utils.reportError('incomingMessage error', 'Error trying to find phone number: ' + phone);
			return callback(err);
		} else if (!student) {
			var newErr = new Error('cannot load student for ' + phone);
			log.error('loading phone #' + phone, err);
			self.Lib.Utils.reportError('incomingMessage error', 'I got a message from an existing number but cannot load student: ' + phone);
			return callback(newErr);
			// router.process(phone, message, null, callback);
		} else {

			// Success
			var msgSummary = ' [' + phone + ': ' + message + ']';
			log.highlight('sms', 'incoming message from student ' + student._id + msgSummary);
			return callback(null, {success: true});
			// router.process(phone, message, student, callback);

		}  
	});

}

Core.findNextQuestion = function(phone) {
	// Check if student is active
}

module.exports = Core;