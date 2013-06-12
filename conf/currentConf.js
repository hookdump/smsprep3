var servicesConf 	= require('./services.js');
var connectionsConf = require('./connections.js');
var env          	= process.env.NODE_ENV || 'development';

var packageJson		= require('../package.json');

var currentConf = {
	services: servicesConf[env]
	, connections: connectionsConf[env]
	, env: env
	, version: packageJson.version
}

module.exports = currentConf;