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

		return callback(null, msg, false, [{phone: student.phone, message: 'this is the next question :)'}]);

	} else {

		// Keep message intact, do not abort.
		return callback(null, msg, false);

	}

}

module.exports = Handlers;