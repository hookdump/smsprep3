// Controllers
var smsController    = require('./controllers/sms.js');

exports.init = function(app, config, lib) {
  smsController.web    (app, config, lib);
}