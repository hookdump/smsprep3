/*
 * smsPREP 3
 * scheduler
 */

var Lib = require('../../lib/wrapper');

// Set app config variables
var appConfig = {
      name:   'scheduler'
};
log.info('starting ' + appConfig.name + ' @ ' + Lib.Config.env + '');

// Listen to bus events
var jobs = require('./jobs');
jobs.init(Lib);