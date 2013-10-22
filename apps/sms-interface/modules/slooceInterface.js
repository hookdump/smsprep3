var slooceInterface = {
	Lib: null
};

var request 	= require("request");
var _       	= require('underscore');
var Step    	= require('step');
var parseString = require('xml2js').parseString;
var debugging	= false;

slooceInterface.init = function(lib) {
	this.Lib	= lib;
};

slooceInterface.noop = function() {
	log.info('slooce interface noop');
};


slooceInterface.initializePhone = function(phone, cb) {
	var self = this;
	var slooceConfig = self.Lib.Config.connections.slooce;

	log.highlight('sms', 'starting phone initialization for ' + phone);

	// Endpoint + XML Setup
	var endpoint 	= self.prepareEndpoint(slooceConfig.initializationEndpoint, slooceConfig, phone);
	var xml 		= self.buildXmlBody(slooceConfig, null);

	// Testing vs. Production delivery
	if (phone.charAt(0) === '9') {
		log.highlight('sms', 'Test Initialization: ' + phone);
		return cb(null);
	} else if (phone.charAt(0) === '9') {
		log.highlight('sms', 'Automated Test Initialization: ' + phone);
		return cb(null);
	} else {

		request.post({url: endpoint, body: xml}, function (err, response, body) {
			log.error('initializing phone ' + phone, err);
			log.highlight('sms', 'Initialization: #' + phone + ' >> [' + response.statusCode + ']');

			var success = (response.statusCode >= 200 && response.statusCode <= 202);
			if (!success) {
				log.warn('response:');
				log.red(response);

				log.warn('body:');
				log.red(body);
			}
			
			return cb(err);
		});
	}

}

slooceInterface.prepareEndpoint = function(endpointTemplate, slooceConfig, phoneNumber) {
	var endpoint = endpointTemplate;
	endpoint = endpoint.replace("{partnerId}", 	slooceConfig.partnerId)
	endpoint = endpoint.replace("{keyword}", 	slooceConfig.globalKeyword);
	endpoint = endpoint.replace("{phone}", 		phoneNumber);

	return endpoint;
};

slooceInterface.buildXmlBody = function(slooceConfig, message) {
	var xml = "";
	xml += '<?xml version="1.0" encoding="ISO-8859-1" ?>';
	xml += '<message id="222-111">';
	xml += '<partnerpassword>' + slooceConfig.partnerPassword + '</partnerpassword>';
	if (message) {
		xml += '<content>' + message + '</content>';
	}
	xml += '</message>';

	log.highlight('sms', 'building XML (len=' + message.length + ') with password=' + slooceConfig.partnerPassword);

	return xml;
};

slooceInterface.stopUser = function(phone, cb) {
	var self = this;
	var slooceConfig = self.Lib.Config.connections.slooce;

	log.highlight('sms', 'stopping slooce user: ' + phone);

	// Endpoint + XML Setup
	var endpoint 	= self.prepareEndpoint(slooceConfig.stopEndpoint, slooceConfig, phone);
	var xml 		= self.buildXmlBody(slooceConfig, null);

	// Testing vs. Production delivery
	if (phone.charAt(0) === '9') {
		log.highlight('sms', 'Test STOP: #' + phone + ' >> OK');
		return cb(null);
	} else if (phone.charAt(0) === '8') {
		log.highlight('sms', 'Automated Test STOP: #' + phone + ' >> OK');
		return cb(null);
	} else {
		request.post({url: endpoint, body: xml}, function (err, response, body) {
			log.error('sending STOP request to slooce', err);
			log.highlight('sms', 'Production stop: #' + phone + ' >> [' + response.statusCode + ']');

			var success = (response.statusCode >= 200 && response.statusCode <= 202);
			if (!success) {
				log.warn('response:');
				log.red(response);

				log.warn('body:');
				log.red(body);
			}
			
			return cb(err);
		});
	}
};

slooceInterface.deliverMessage = function(phone, message, databaseOnly, cb) {
	var self = this;
	var slooceConfig = self.Lib.Config.connections.slooce;
	var isAutomatedTest = (phone.charAt(0) === '8');

	if (!isAutomatedTest) {
		log.highlight('sms', 'preparing SMS delivery for ' + phone + ' (' + message.length + ')');
	}

	// Endpoint + XML Setup
	var endpoint 	= self.prepareEndpoint(slooceConfig.outgoingEndpoint, slooceConfig, phone);
	var xml 		= self.buildXmlBody(slooceConfig, message);
	var isTesting 	= (phone.charAt(0) === '9') || isAutomatedTest || databaseOnly;

	// Store Message (async)
	if (!isAutomatedTest) {
		self.Lib.Message.create({from: 'smsprep', to: phone, msg: message, test: isTesting}, function(err, data) {
			log.highlight('sms', 'outgoing SMS stored in database');
		});
	}

	// Testing vs. Production delivery
	if (isTesting) {
		if (!isAutomatedTest) {
			log.highlight('sms', 'Test delivery: {' + message + '} => #' + phone + ' >> OK');
		}
		return cb(null);
	} else {
		request.post({url: endpoint, body: xml}, function (err, response, body) {
			log.error('delivering message to slooce', err);
			log.highlight('sms', 'Production delivery: {' + message + '} => #' + phone + ' >> [' + response.statusCode + ']');

			var success = (response.statusCode >= 200 && response.statusCode <= 202);
			if (!success) {
				log.warn('response:');
				log.red(response);

				log.warn('body:');
				log.red(body);
			}
			
			return cb(err);
		});
	}
};

slooceInterface.sendMessages = function(payload, databaseOnly) {
	var self = this;

	var sendNext = function(queue) {
		if (queue.length === 0) {
			// Queue emptied! Success.
			return true;
		} else {
			var nextMessage = queue.shift();
			if (nextMessage) {

				// Message block
				if (nextMessage.phone && nextMessage.message) {
					var isAutomatedTest = (nextMessage.phone.charAt(0) === '8');
					if (!isAutomatedTest) {
						log.highlight('sms', 'sending message to ' + nextMessage.phone + ': ' + nextMessage.message);
					}
					
					self.deliverMessage(nextMessage.phone, nextMessage.message, databaseOnly, function(err) {
						sendNext(queue);
					});
				}

				// Delay block
				if (nextMessage.delay) {
					log.highlight('sms', 'waiting ' + nextMessage.delay + 'ms');
					setTimeout(function() {
						sendNext(queue);
					}, nextMessage.delay);
				}

			}

		}
	};

	sendNext(payload);

	payload.forEach(function(item) {
	});
};

slooceInterface.incomingMessage = function(xml) {
	// var xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><message id='1320192341004-1320387794654'><user>14082396036</user><keyword>ENGTRIAL</keyword><content></content></message>";

	if (debugging) {
		log.debug('received some xml:');
		log.info( xml );
	}

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
			
			if (debugging) {
				log.debug( messageData );
			}
			slooceInterface.Lib.Bus.publish('sms.in', {phone: messageData.phone, msg: messageData.content, command: messageData.command});

		}

		
	});
};

module.exports = slooceInterface;