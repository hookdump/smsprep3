var Core = {
	Lib: null
};

var _       	= require('underscore');
var Step    	= require('step');
var Checks    	= require('./checks');
var Handlers  	= require('./handlers');

Core.init = function(lib) {
	this.Lib	= lib;
	Checks.init(lib);
};

Core.receiveMessage = function(phone, message, callback) {
	var self = this;

	// Find student
	self.Lib.Student.findOne({ phone: phone }, function(err, student) {
		var msgSummary = ' [' + phone + ': ' + message + ']';

		if (err) {
			log.error('loading phone #' + phone, err);
			self.Lib.Utils.reportError('receiveMessage', 'Error trying to find phone number: ' + phone);
			return callback(err);
		} else if (!student) {
			// var newErr = new Error('cannot load student for ' + phone);
			log.error('loading phone #' + phone, err);
			log.highlight('sms', 'incoming message from unknown student' + msgSummary);
			self.Lib.Utils.reportError('receiveMessage', 'message received (' + message + ') from an inexistent phone: ' + phone);
			var ret = [];
			if (message == "PING") {
				ret.push({phone: phone, message: "PONG"});
			}

			return callback(null, ret);
		} else {

			// Success
			log.highlight('sms', 'incoming message from student ' + student._id + msgSummary);

			self.processMessage(student, message, function(err, payload) {
				return callback(err, payload);
			});
		}  
	});
};

Core.processMessage = function(student, message, callback) {
	var self = this;
	var payload = [];

	Step(
		function _startChain() {
			var upperMessage = message.toUpperCase();
			this(null, upperMessage);
		},
		function _active(_err, msg) {
			var next = this;
			Checks.isActive(student, message, function(err, newMsg, abort, addPayload) {
				if (addPayload) payload = payload.concat(addPayload);
				if (abort) 		return callback(null, payload); 
				next(err, newMsg);
			});
		},
		function _confirmed(err, _msg) {
			var next = this;
			Checks.isConfirmed(student, _msg, function(err, newMsg, abort, addPayload) {
				if (addPayload) payload = payload.concat(addPayload);
				if (abort) 		return callback(null, payload); 
				next(err, newMsg);
			});
		},
		function _commandStop(err, _msg) {
			var next = this;
			Handlers.commandStop(student, _msg, function(err, newMsg, abort, addPayload) {
				if (addPayload) payload = payload.concat(addPayload);
				if (abort) 		return callback(null, payload); 
				next(err, newMsg);
			});
		},
		function _requestNextQuestion(err, _msg) {
			var next = this;
			Handlers.nextQuestion(student, _msg, function(err, newMsg, abort, addPayload) {
				if (addPayload) payload = payload.concat(addPayload);
				if (abort) 		return callback(null, payload); 
				next(err, newMsg);
			});
		},
		function _handleAnswer(err, _msg) {
			var next = this;
			Handlers.handleAnswer(student, _msg, function(err, newMsg, abort, addPayload) {
				if (addPayload) payload = payload.concat(addPayload);
				if (abort) 		return callback(null, payload); 
				next(err, newMsg);
			});
		},
		function _finish(err, _msg) {
			// Passed all checks. Process message! :)
			log.warn('passed all checks. MSG: ' + _msg);

			// The end :)
			return callback(null, payload);
		}
	);
};

module.exports = Core;