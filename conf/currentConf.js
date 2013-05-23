var servicesConf 	= require('./services.js');
var connectionsConf = require('./connections.js');
var env          	= process.env.NODE_ENV || 'development';

console.log('@@@ loading configuration for environment ' + env);
var currentConf = {
	services: servicesConf[env]
	, connections: connectionsConf[env]
	, env: env
}

module.exports = currentConf;