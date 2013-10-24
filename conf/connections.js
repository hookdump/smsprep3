// Instance: smsprep
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
		mongo: 			'mongodb://heroku:b0031d17596868daa5eb577e5214d9fc@alex.mongohq.com:10018/app15779401'
		, rabbitmq_in: 	'amqp://13QYPd_a:ox7YJxWLxOXwdNbBGNTAYVp-vm2ixEID@skinned-toadflax-2.bigwig.lshift.net:10409/AeOhL2crTBjEi_gUy39NxA'
		, rabbitmq_out:	'amqp://13QYPd_a:ox7YJxWLxOXwdNbBGNTAYVp-vm2ixEID@skinned-toadflax-2.bigwig.lshift.net:10408/AeOhL2crTBjEi_gUy39NxA'
		, redis: 		'redis://redistogo:43a0ab47a84f1731ecabe6d53b2a3bd9@viperfish.redistogo.com:9645/'
	},
	production: {
		mongo: 			'mongodb://heroku:ff57e846d04b6cb160a02fd121599c33@linus.mongohq.com:10093/app15670097'
		, rabbitmq_in: 	'amqp://mytTXRE7:HKLs4D221aQB6Qh47QhXVMAgDblV5vZh@scared-vilthuril-1.bigwig.lshift.net:10007/7ldXPgMKM76dlWQGqvk7VA'
		, rabbitmq_out: 'amqp://mytTXRE7:HKLs4D221aQB6Qh47QhXVMAgDblV5vZh@scared-vilthuril-1.bigwig.lshift.net:10006/7ldXPgMKM76dlWQGqvk7VA'
		, redis: 		'redis://redistogo:a35642f27259c398d99aaa1d1684f361@squawfish.redistogo.com:9412/'
	},
	instance: 'smsprep'
};

console.log(myConfig.instance);

// Add slooce configuration to all environments:
var slooceConfig = {
	partnerId: 			'p9328904'
	, partnerPassword: 	'f8n29aa3'
	, outgoingEndpoint: 'http://sloocetech.net:8084/spi-war/spi/{partnerId}/{phone}/{keyword}/messages/mt'
	, stopEndpoint: 	'http://sloocetech.net:8084/spi-war/spi/{partnerId}/{phone}/{keyword}/messages/stop'
	, globalKeyword: 	'SPTRIAL'
	, initializationEndpoint: 'http://sloocetech.net:8084/widgets/y/w0548qos?mdn={phone}'
};
myConfig['test']['slooce'] 			= slooceConfig;
myConfig['development']['slooce'] 	= slooceConfig;
myConfig['staging']['slooce'] 		= slooceConfig;
myConfig['production']['slooce'] 	= slooceConfig;

module.exports = myConfig;