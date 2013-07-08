var should 		= require("should")
var basepath 	= '../';
var keep		= false;
var Api 		= require(basepath + 'apps/api-interface/modules/api.js');

var testStudent 	= require('./assets/temp.student1.js');
var testStudentApi 	= require('./assets/temp.studentApi.js');

describe('api-interface service', function() {
	global.beQuiet 	= true;
	var Lib 		= require(basepath + 'lib/wrapper');
	var curStudent 	= null;

	Api.init(Lib);

	beforeEach(function(done) {
		Lib.Student.upsertStudent(testStudentApi.query, testStudent.data, 'start', function(err, doc) {
			curStudent = doc;
			done();
		});
	});

	afterEach( function(done) {
		if (keep) {
			done();
		} else {
			Lib.Student.remove({partner: 'TEMP'}, function() { done(); });	
		}
	});
	
	it('start student', function(done) {
		var newquery = testStudentApi.query;
		newquery.externalId = 'U003';

		Api.Student.start(newquery, testStudentApi.data, function(err, response) {
			response.success.should.be.true;
			should.exist(response.studentId);
			done();
		});
	});

	it('edit student', function(done) {
		Api.Student.edit(testStudentApi.query, testStudentApi.data, function(err, response) {
			response.success.should.be.true;
			should.exist(response.studentId);
			done();
		});
	});

	it('activate student', function(done) {
		Api.Student.activate(testStudentApi.query, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('deactivate student', function(done) {
		Api.Student.deactivate(testStudentApi.query, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('check student status', function(done) {
		Api.Student.status(testStudentApi.query, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('reconfirm student', function(done) {
		Api.Student.reconfirm(testStudentApi.query, function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

	it('send custom message', function(done) {
		Api.Student.sendMessage(testStudentApi.query, 'testing 123', function(err, response) {
			response.success.should.be.true;
			done();
		});
	});

})
