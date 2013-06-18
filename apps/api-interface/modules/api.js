var Api = {
	Lib: null
};

var _       = require('underscore');
var Step    = require('step');

Api.init = function(lib) {
	Api.Lib	= lib;
};

Api.Student = {
	upsert: function(studentParams, studentData, method, cb) {
		var findQuery = Api.Lib.Utils.buildFindQuery( studentParams );
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
	start: function(studentParams, studentData, callback) {
		log.apiMethod('student.start');
		Api.Student.upsert(studentParams, studentData, 'start', callback);
	},
	edit: function(studentParams, studentData, callback) {
		log.apiMethod('student.edit');
		Api.Student.upsert(studentParams, studentData, 'edit', callback);
	},

	changeActive: function(studentParams, activate, cb) {
		var findQuery = Api.Lib.Utils.buildFindQuery( studentParams );
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
	activate: function(studentParams, callback) {
		log.apiMethod('student.activate');
		Api.Student.changeActive(studentParams, true, callback);
	},
	deactivate: function(studentParams, callback) {
		log.apiMethod('student.deactivate');
		Api.Student.changeActive(studentParams, false, callback);
	},

	status: function(studentParams, callback) {
		log.apiMethod('student.status');
		var findQuery 	= Api.Lib.Utils.buildFindQuery( studentParams );
		var sendBack 	= {success: true};

		Api.Lib.Student.loadData( findQuery, function(err, myStudent) {

			if (myStudent) {

				var retStatus = {
					studentId: myStudent._id
					, active: myStudent.active
					, externalId: myStudent.externalId
					, confirmed: myStudent.confirmed
					, created: myStudent.joined
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

	reconfirm: function(studentParams, callback) {
		log.apiMethod('student.reconfirm');
		callback(null, {success: true});
	},

	sendMessage: function(studentParams, msg, callback) {
		log.apiMethod('student.send');
		callback(null, {success: true});
	},

};

module.exports = Api;