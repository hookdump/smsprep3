// Controllers
var usersController 	= require('./controllers/users.js');
var contentController 	= require('./controllers/content.js');
var mainController 		= require('./controllers/main.js');

exports.init = function(app, config, lib, passport) {
	mainController.web		(app, config, lib, passport);
	usersController.web		(app, config, lib, passport);
	contentController.web 	(app, config, lib, passport);
}

exports.initSocket = function(socket) {
	socket.emit('handshake', {message: 'server is listening...'});

	usersController.io 		(socket);
	contentController.io 	(socket);
	mainController.io 		(socket);
}