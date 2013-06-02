var servicesConf 	= require('./services.js');
var connectionsConf = require('./connections.js');
var env          	= process.env.NODE_ENV || 'development';

var currentConf = {
	services: servicesConf[env]
	, connections: connectionsConf[env]
	, env: env
}

console.log(currentConf);

module.exports = currentConf;