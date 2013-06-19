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

	// Endpoint Setup
	var endpoint = slooceConfig.initializationEndpoint;
	endpoint = endpoint.replace("{phone}", 		phone);

	// Testing vs. Production delivery
	if (phone.charAt(0) === '9') {
		log.highlight('sms', 'TEST Initialization: ' + phone);
		return cb(null);
	} else {
		request.get({url: endpoint}, function (err, response, body) {
			log.error('initializing phone ' + phone, err);
			log.highlight('sms', 'PRODUCTION Initialization: #' + phone + ' >> [' + response.statusCode + ']');
			log.warn(body);

			return cb(err);
		});
	}

}

slooceInterface.deliverMessage = function(phone, message, cb) {
	var self = this;
	var slooceConfig = self.Lib.Config.connections.slooce;

	log.highlight('sms', 'preparing SMS delivery for ' + phone + ' (' + message.length + ')');

	// Endpoint Setup
	var endpoint = slooceConfig.outgoingEndpoint;
	endpoint = endpoint.replace("{partnerId}", 	slooceConfig.partnerId)
	endpoint = endpoint.replace("{keyword}", 	slooceConfig.globalKeyword);
	endpoint = endpoint.replace("{phone}", 		phone);

	// XML Body Setup
	var xml = "";
	xml += '<?xml version="1.0" encoding="ISO-8859-1" ?>';
	xml += '<message id="1294302114388-1294447192618">';
	xml += '<partnerpassword>' + slooceConfig.partnerPassword + '</partnerpassword>';
	xml += '<content>' + message + '</content>';
	xml += '</message>';

	// Testing vs. Production delivery
	if (phone.charAt(0) === '9') {
		log.highlight('sms', 'Test delivery: {' + message + '} => #' + phone + ' >> OK');
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

	// curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: text/plain')); 
};

slooceInterface.sendMessages = function(payload) {
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
					log.highlight('sms', 'sending message to ' + nextMessage.phone + ': ' + nextMessage.message);
					self.deliverMessage(nextMessage.phone, nextMessage.message, function(err) {
						sendNext(queue);
					});
				}

				// Delay block
				if (nextMessage.delay) {
					log.highlight('sms', 'waiting ' + nextMessage.delay + ' seconds');
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
			slooceInterface.Lib.Bus.publish('sms.in', {phone: messageData.phone, msg: messageData.content});

		}

		
	});
};

module.exports = slooceInterface;