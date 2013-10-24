var servicesConf 	= require('./services.js');
var connectionsConf = require('./connections.js');
var env          	= process.env.NODE_ENV || 'development';

var packageJson		= require('../package.json');

var currentConf = {
	services: servicesConf[env]
	, connections: connectionsConf[env]
	, instance: connectionsConf['instance']
	, env: env
	, version: packageJson.version
}

if (currentConf.instance == 'smsprep') currentConf.appName = 'smsPREP';
if (currentConf.instance == 'eprep') currentConf.appName = 'ePrep';

module.exports = currentConf;