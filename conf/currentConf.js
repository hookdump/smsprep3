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

if (currentConf['instance'] == 'smsprep') 	currentConf.name = 'smsPREP';
if (currentConf['instance'] == 'eprep') 	currentConf.name = 'ePrep';

console.log(currentConf.name);

module.exports = currentConf;