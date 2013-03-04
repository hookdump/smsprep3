var usersController = require('./controllers/users.js');
var contentController = require('./controllers/content.js');
var mainController = require('./controllers/main.js');

exports.init = function(app, config, lib, passport) {

  mainController    (app, config, lib, passport);
  usersController   (app, config, lib, passport);
  contentController (app, config, lib, passport);

}
