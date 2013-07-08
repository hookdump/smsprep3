var should 		= require("should");
var request 	= require("request");
var basepath 	= '../';
var Core 		= require(basepath + 'apps/smsprep-core/modules/core.js');

var keep		= false;
var testStudent	= require('./assets/core.student1.js');
var confStudent	= require('./assets/core.student2.js');
var Step		= require('Step');

describe('smsprep-core service', function() {
	global.beQuiet 	= true;
	var Lib 		= require(basepath + 'lib/wrapper');

	var curStudent 			= null;
	var curConfirmedStudent = null;

	Core.init(Lib);

	beforeEach(function(done) {
		Step(
			function upsertTestStudent() {
				var next = this;
				Lib.Student.upsertStudent(testStudent.query, testStudent.data, 'start', function(err, doc) {
					curStudent = doc;
					next(err);
				});
			},
			function upsertConfirmedStudent(err) {
				log.error('upserting test student', err);

				var next = this;
				Lib.Student.upsertStudent(confStudent.query, confStudent.data, 'start', function(err, doc) {
					curConfirmedStudent = doc;
					next(err);
				});
			},
			function finish(err) {
				log.error('upserting confirmed student', err);
				done();
			}
		);

	});

	afterEach( function(done) {
		if (keep) {
			done();
		} else {
			Lib.Student.remove({partner: {'$in': ['TEMP', 'TEST.CORE']}}, function() { done(); });	
		}
	});

	var hitMessage2 = function(phone, message, cb) {
		var myUrl = 'http://localhost:8201/msg/' + phone + '/' + message;
	    return request.get({url: myUrl, json: true}, cb);
	};

	var hitMessage = function(phone, message, cb) {
		Core.receiveMessage(phone, message, null, function(err, response) {
			log.highlight('sms', 'emulating response for [' + phone + ': Payload (' + response.length + ')]');
			if (response.length > 0) log.success(response);

			return cb(err, {statusCode: 200}, {success: true, payload: response});
		});
	}

	it('handle messages from inexistent students', function(done) {
		hitMessage('98887776060', 'HELLO', function (err, response, body) {
			should.not.exist(err);
			response.statusCode.should.equal(200);

			body.success.should.exist;
			body.payload.should.not.exist;

			done();
		});
	});

	it('handle messages from unconfirmed students', function(done) {
		hitMessage(testStudent.data.phone, 'N', function (err, response, body) {
			body.success.should.exist;
			body.payload.should.have.lengthOf(0);
			done();
		})
	});

	it('handle confirmation message', function(done) {
		hitMessage(testStudent.data.phone, 'CONFIRM', function (err, response, body) {

			// Should respond with 2 messages + 1 delay
			body.success.should.exist;
			body.payload.should.have.lengthOf(3);

			// Welcome message
			should.exist(body.payload[0].message);
			body.payload[0].message.should.include('Welcome');
			should.equal(body.payload[0].phone, testStudent.data.phone);
			should.not.exist(body.payload[0].delay);
			should.not.exist(body.payload[0].wtf);

			// 5 sec delay
			should.equal(body.payload[1].delay, 5000);
			should.not.exist(body.payload[1].message);
			should.not.exist(body.payload[1].phone);

			// Check if the user is actually confirmed
			Lib.Student.loadData(testStudent.query, function(err, studentData) {
				studentData.confirmed.should.equal(true);
				done();
			});

		})
	});
	
})
