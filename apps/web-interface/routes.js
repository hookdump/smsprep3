// Controllers
var usersController 	= require('./controllers/users.js');
var contentController 	= require('./controllers/content.js');
var mainController 		= require('./controllers/main.js');

exports.init = function(app, config, lib, passport) {
	mainController.web		(app, config, lib, passport);
	usersController.web		(app, config, lib, passport);
	contentController.web 	(app, config, lib, passport);
}

exports.initSocket = function(socket, config, lib) {
	socket.emit('handshake', {message: 'server is listening...'});

	usersController.io 		(socket, config, lib);
	contentController.io 	(socket, config, lib);
	mainController.io 		(socket, config, lib);
}