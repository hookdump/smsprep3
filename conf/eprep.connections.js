// Instance: eprep
// Config: connections

var myConfig = {
	test: {
		mongo: 			'mongodb://localhost/smsprep3_test'
		, rabbitmq_in: 	'amqp://localhost'
		, rabbitmq_out:	'amqp://localhost'
		, redis: 		'redis://localhost:6379'
	},
	development: {
		mongo: 			'mongodb://localhost/smsprep3'
		, rabbitmq_in: 	'amqp://localhost'
		, rabbitmq_out:	'amqp://localhost'
		, redis: 		'redis://localhost:6379'
	},
	staging: {
		mongo: 			'mongodb://heroku:17a819929bf7f82aef5e696cab335526@paulo.mongohq.com:10089/app18672561'
		, rabbitmq_in: 	'amqp://OHTtKyGp:aTQbonz4V7MdftNlVGF4VIf8sq-JQO_B@leaping-woundwort-5.bigwig.lshift.net:10823/e9-BrMRp0v-G'
		, rabbitmq_out:	'amqp://OHTtKyGp:aTQbonz4V7MdftNlVGF4VIf8sq-JQO_B@leaping-woundwort-5.bigwig.lshift.net:10822/e9-BrMRp0v-G'
		, redis: 		'redis://redistogo:9458afdf3dabc41600b14369ee329920@beardfish.redistogo.com:10567/'
	},
	production: {
		mongo: 			'mongodb://heroku:d036dec5cfd621324d4cee30eaa6ddaa@paulo.mongohq.com:10076/app18466651'
		, rabbitmq_in: 	'amqp://fGmb-Ksd:TasnULDyzq4LASSt4-IzYSB7YYYlGNY6@leaping-snowdrop-4.bigwig.lshift.net:10827/zMg0fDLzxkH2'
		, rabbitmq_out: 'amqp://fGmb-Ksd:TasnULDyzq4LASSt4-IzYSB7YYYlGNY6@leaping-snowdrop-4.bigwig.lshift.net:10826/zMg0fDLzxkH2'
		, redis: 		'redis://redistogo:f417a50781ec32ff4f9a6bdb6e5899d6@scat.redistogo.com:10248/'
	},
	instance: 'eprep'
};

// Add slooce configuration to all environments:
var slooceConfig = {
	partnerId: 			'eprepsms876'
	, partnerPassword: 	'9jgA76FGQ23SAD'
	, globalKeyword: 	'EPREPSMS'
	, outgoingEndpoint: 		'http://sloocetech.net:8084/spi-war/spi/{partnerId}/{phone}/{keyword}/messages/mt'
	, initializationEndpoint: 	'http://sloocetech.net:8084/spi-war/spi/{partnerId}/{phone}/{keyword}/messages/start'
	, stopEndpoint: 			'http://sloocetech.net:8084/spi-war/spi/{partnerId}/{phone}/{keyword}/messages/stop'	
};

myConfig['test']['slooce'] 			= slooceConfig;
myConfig['development']['slooce'] 	= slooceConfig;
myConfig['staging']['slooce'] 		= slooceConfig;
myConfig['production']['slooce'] 	= slooceConfig;

module.exports = myConfig;