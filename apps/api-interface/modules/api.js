var Api = {
	Lib: null
};

var _       = require('underscore');
var Step    = require('step');

var slooceInterface = require('../../sms-interface/modules/slooceInterface');

Api.init = function(lib) {
	Api.Lib	= lib;
	slooceInterface.init(lib);
};

/*
 * This API receives queries ALREADY BUILT.
 *
 */
Api.Student = {
	upsert: function(findQuery, studentData, method, cb) {
		Api.Lib.Student.upsertStudent( findQuery , studentData , method, function(err, updatedStudent) {
			log.error('upserting student', err);

			var sendBack = {success: true};
			if (err) {
				sendBack['success'] = false;
				sendBack['errors'] = err.errors;
			} else {
				sendBack['studentId'] = updatedStudent._id;
			}

			return cb(err, sendBack);
		});
	},
	start: function(findQuery, studentData, callback) {
		log.apiMethod('student.start');
		Api.Student.upsert(findQuery, studentData, 'start', function(err, sendBack) {

			// Activate phone
			slooceInterface.initializePhone(studentData.phone, function(err) {
				log.error('triggering phone initialization', err);
				log.success('phone initialized!');

				// Send welcome message:
				log.success('sending welcome message...');
				var welcomePayload = [{phone: studentData.phone, message: Api.Lib.Utils.getMessage('*welcome', studentData) }];
				Api.Lib.Bus.publish('sms.out', {payload: welcomePayload});
				
				log.success('calling back...');
				return callback(err, sendBack);
			});

		});
	},
	edit: function(findQuery, studentData, callback) {
		log.apiMethod('student.edit');
		Api.Student.upsert(findQuery, studentData, 'edit', callback);
	},

	changeActive: function(findQuery, activate, cb) {
		Api.Lib.Student.activateStudent( findQuery , activate , function(err, affected) {
			log.error('de/activating student', err);

			var sendBack = {success: true};
			if (affected === 0) {
				sendBack['success'] = false;
				sendBack['errors'] = ['the student ' + findQuery.externalId + ' does not exist in our database!']; 
			}
			if (err) {
				sendBack['success'] = false;
				sendBack['errors'] = ['database error while activating student'];
			}

			return cb(err, sendBack);
		});
	},
	activate: function(findQuery, callback) {
		log.apiMethod('student.activate');
		Api.Student.changeActive(findQuery, true, callback);
	},
	deactivate: function(findQuery, callback) {
		log.apiMethod('student.deactivate');
		Api.Student.changeActive(findQuery, false, callback);
	},

	status: function(findQuery, callback) {
		log.apiMethod('student.status');
		var sendBack 	= {success: true};

		Api.Lib.Student.loadData( findQuery, function(err, myStudent) {

			if (myStudent) {

				var retStatus = {
					studentId: myStudent._id
					, externalId: myStudent.externalId
					, active: myStudent.active
					, confirmed: myStudent.confirmed
					, created: myStudent.joined

					, timezone: myStudent.timezone
					, schedule: myStudent.schedule

					, lessons: myStudent.lessons
					, lessongroups: myStudent.lessongroups
					, stats: {
						totalAnswers: 0
						, correctAnswers: 0
					}
				};
				sendBack['status'] = retStatus;

			} else {

				sendBack['success'] = false;
				sendBack['errors'] = ['the student ' + findQuery.externalId + '@' + findQuery.partner + ' does not exist in our database!']; 

			}

			callback(err, sendBack);

		});

	},

	reconfirm: function(findQuery, callback) {
		log.apiMethod('student.reconfirm');
		callback(null, {success: true});
	},

	sendMessage: function(findQuery, msg, callback) {
		log.apiMethod('student.send');

		Api.Lib.Student.loadData( findQuery, function(err, myStudent) {

			var customPayload = [{phone: myStudent.phone, message: msg }];
			log.warn('API: Delivering custom message for #' + myStudent.phone + ': ' + msg);
			Api.Lib.Bus.publish('sms.out', {payload: customPayload});
			callback(null, {success: true});

		});
		
	},

};

module.exports = Api;