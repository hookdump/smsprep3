var slooceInterface = {};

var _       = require('underscore');
var Step    = require('step');
var parseString = require('xml2js').parseString;

slooceInterface.noop = function() {
	log.info('slooce interface noop');
};

slooceInterface.sendMessage = function(phone, message) {

};

slooceInterface.incomingMessage = function(xml) {
	// var xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><message id='1320192341004-1320387794654'><user>14082396036</user><keyword>ENGTRIAL</keyword><content></content></message>";

	log.debug('received some xml:');
	log.info( xml );

	if (!xml) {
		log.error('parsing incoming XML from slooce', new Error('empty xml string'));
		return false;
	}

	parseString(xml, function (err, result) {

		if (!result) {
			log.error('parsing incoming XML from slooce', new Error('parsed string is empty/null'));
			return false;
		}

		if (result.message) {

			// got a message!
			var rawMessage 	= result.message;
			
			var messageData = {
				phone: 		(rawMessage.user) 		? rawMessage.user[0] 	: null
				, keyword: 	(rawMessage.keyword) 	? rawMessage.keyword[0] : null
				, content: 	(rawMessage.content) 	? rawMessage.content[0] : null
				, command: 	(rawMessage.command) 	? rawMessage.command[0] : null
			};

			log.highlight('sms', 'incoming message from ' + messageData.phone + ': ' + messageData.content);
			log.debug( messageData );

		}

		
	});
};

module.exports = slooceInterface;