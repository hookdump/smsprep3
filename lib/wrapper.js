var log_colors = require('./log_colors');

var User 	= require('./models/user');
var Student = require('./models/student');
var Content = require('./models/content');

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
};