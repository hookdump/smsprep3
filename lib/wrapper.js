var log_colors = require('./log_colors');

// Order matters!
var User 	= require('./models/user');
var Content = require('./models/content');
var Student = require('./models/student');
var Phone 	= require('./models/phone');

var Message 		= require('./models/message');
var CronDelivery 	= require('./models/crondelivery');

var Utils = require('./utils');

var Redis = require('./redis');

var currentConf = require('../conf/currentConf.js');

var busOptions = {
	log: log.rabbit
	, url: currentConf.connections.rabbitmq_out	// TODO: Implement two bus connections, in and out?
};
var serviceBus = require('servicebus').bus(busOptions);

module.exports = {
	User: 			User
	, Student: 		Student
	, Content: 		Content
	, Phone: 		Phone

	, CronDelivery: CronDelivery
	, Message: 		Message

	, Config: 		currentConf
	, Bus: 			serviceBus
	, Utils: 		Utils
	, Redis: 		Redis
};