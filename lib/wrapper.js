var log_colors = require('./log_colors');

var User 	= require('./models/user');
var Student = require('./models/student');
var Content = require('./models/content');

var currentConf = require('../conf/currentConf.js');

module.exports = {
	User: 			User
	, Student: 		Student
	, Content: 		Content
	, Config: 		currentConf
};