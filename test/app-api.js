var should 		= require("should")
var basepath 	= '../';
var keep		= false;
var Api 		= require(basepath + 'apps/api-interface/modules/api.js');

var testStudent 	= require('./assets/testStudent.js');
var testStudentApi 	= require('./assets/testStudentApi.js');

describe('api-interface service', function() {
	global.beQuiet 	= false;
	var Lib 		= require(basepath + 'lib/wrapper');
	var curStudent 	= null;

	Api.init(Lib);

	beforeEach(function(done) {
		Lib.Student.upsertStudent({externalId: testStudentApi.params.uid, partner: testStudentApi.params.partner}, testStudent, 'start', function(err, doc) {
			curStudent = doc;
			done();
		});
	});

	afterEach( function(done) {
		if (keep) {
			done();
		} else {
			Lib.Student.remove({}, function() { done(); });	
		}
	});
	
	it('start student', function(done) {
		var newParams = testStudentApi.params;
		newParams.uid = '222';
		Api.Student.start(newParams, testStudentApi.data, function(err, response) {
			response.success.should.be.true;
			should.exist(response.studentId);
			done();
		});
	});

	it('edit student', function(done) {
		Api.Student.edit(testStudentApi.params, testStudentApi.data, function(err, response) {
			response.success.should.be.true;
			should.exist(response.studentId);
			done();
		});
	});

	it('activate student', function(done) {
		Api.Student.activate(testStudentApi.params, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('deactivate student', function(done) {
		Api.Student.deactivate(testStudentApi.params, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('check student status', function(done) {
		Api.Student.status(testStudentApi.params, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('reconfirm student', function(done) {
		Api.Student.reconfirm(testStudentApi.params, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('send custom message', function(done) {
		Api.Student.sendMessage(testStudentApi.params, 'testing 123', function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

})
