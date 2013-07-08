var Handlers = {
	Lib: null
};

var _       	= require('underscore');
var Step    	= require('step');

Handlers.init = function(lib) {
	this.Lib	= lib;
};

// Checks standard callback is:
// function(err, newMsg, abort, addPayload)

// Payload formats is:
// [{phone: 12223334444, message: 'testing'}, {delay: 5}]

Handlers.nextQuestion = function(student, msg, callback) {
	var self = this;

	if (msg === 'N' || msg === 'NEXT') {

		student.getNextQuestion(true, function(err, nextQuestionText) {
			return callback(err, msg, false, [{phone: student.phone, message: nextQuestionText}]);
		});

	} else {

		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}
}

Handlers.handleAnswer = function(student, msg, callback) {
	var self = this;
	var possibleAnswers = ['A', 'B', 'C', 'D', 'E', 'F'];

	if (possibleAnswers.indexOf(msg) > -1) {

		student.answerQuestion(msg, function(err, addPayload) {
			return callback(err, msg, false, addPayload);
		});

	} else {

		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}
}

Handlers.commandStop = function(student, msg, callback) {
	var self = this;

	if (msg === 'STOP') {

		log.red('[stop] Got a STOP request from user. Pinging slooce...');
		Lib.Bus.publish('sms.stop', {phone: student.phone});
		var stopPayload = [{phone: student.phone, message: 'stopped!!!'}];
		return callback(null, msg, stopPayload);

	} else if (msg === '@@Q') {

		log.red('[stop] Got a STOP command from Slooce. Deactivating user...');
		log.warn('TODO!');
		return callback(null, msg, true);

	} else {

		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}

}


module.exports = Handlers;