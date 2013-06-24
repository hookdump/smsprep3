var log_colors = require('./log_colors');

// Order matters!
var User 	= require('./models/user');
var Content = require('./models/content');
var Student = require('./models/student');

var Utils = require('./utils');

var currentConf = require('../conf/currentConf.js');

var busOptions = {
	log: log.rabbit
	, url: currentConf.connections.rabbitmq_in	// TODO: Implement two bus connections, in and out?
};
var serviceBus = require('servicebus').bus(busOptions);

module.exports = {
	User: 			User
	, Student: 		Student
	, Content: 		Content
	, Config: 		currentConf
	, Bus: 			serviceBus
	, Utils: 		Utils
};