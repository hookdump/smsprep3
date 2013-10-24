var Handlers = {
	Lib: null
};

var _       	= require('underscore');
var Step    	= require('step');

Handlers.init = function(lib) {
	log.green('initializing core handlers lib...');
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
	var myself = this;

	if (msg === 'STOP' || msg === '@@Q') {

		if (msg === 'STOP') {
			log.red('[stop] Got a STOP request from user');
		} else {
			log.red('[stop] Got a STOP command from Slooce');
		}

		// Send goodbye message if needed
		var retPayload = [];
		if (student.active) {
			log.red('[stop] User was active before. Preparing goodbye response...');
			retPayload.push( {phone: student.phone, message: myself.Lib.Utils.getMessage('*stop', student) } );

		}

		// Deactivate student
		log.red('[stop] Deactivating student...');
		student.deactivate(function(err) {
			log.error('deactivating student', err);

			// Ping slooce
			if (msg === 'STOP') {
				log.red('[stop] Pinging slooce...');
				myself.Lib.Bus.publish('sms.stop', {phone: student.phone});
				
				log.red('[stop] Calling back to handler...');
				return callback(null, msg, true, retPayload);
			} else {
				log.red('[stop] Received ping from slooce!');
				student.uninitialize(function(err, aff) {
					log.error('uninitializing student', err);
					log.red('[stop] Calling back to handler...');
					return callback(null, msg, true, retPayload);
				});
			}

		});

	} else {

		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}

}


module.exports = Handlers;