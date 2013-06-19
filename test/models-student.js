var should 		= require("should")
var basepath 	= '../';
var keep		= false;
var testStudent	= require('./assets/temp.student1.js');

var _ 			= require("underscore")

describe('Student model', function() {
	global.beQuiet 	= true;
	
	var Lib = require(basepath + 'lib/wrapper');
	var curStudent = null;
		
	beforeEach(function(done) {
		Lib.Student.upsertStudent(testStudent.query, testStudent.data, 'start', function(err, doc) {
			if (err) {
				console.log(err);	
			}
			
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

	describe('creation', function() {
		it('returns the created student', function() {
			should.exist(curStudent);
		});
		
		it('the returned object is valid', function() {
			log.warn( curStudent );
			curStudent.externalId.should.equal('U001');
			curStudent.lessons.should.have.length(3);
			should.exist(curStudent.joined);
		});
	});

	describe('update', function() {
		var testData2 = {};
		testData2.phone = '13334445555';
		testData2.lessons = ['YYY', 'ZZZ'];
		var curStudent2 = {};

		it('returns the updated student', function(done) {
			Lib.Student.upsertStudent(testStudent.query, testData2, 'edit', function(err, doc) {
				should.exist(doc);
				should.not.exist(err);
				curStudent2 = doc;
				done();
			});
		});

		it('the returned object is valid', function() {
			// it has changed!
			curStudent2.lessons.should.have.length(2);

			// it has not changed!
			curStudent2.externalId.should.equal('U001');
			curStudent2.email.should.equal( testStudent.data.email );
		});
	});

	describe('data validation', function() {
		var invalidPhone = {phone: '1234'};
		var invalidEmail = {email: 'foo'};
		var invalidSchedule = {schedule: 'foo'};
		var invalidTimezone = {timezone: 'foo'};

		var testInvalidField = function(query, title) {
			it(title + ' validation', function(done) {
				Lib.Student.upsertStudent(testStudent.query, query, 'edit', function(err, updatedStudent) {
					should.exist(err);
					should.exist(err.errors);
					err.errors.length.should.be.above(0);
					done();
				});
			});			
		};

		testInvalidField(invalidPhone, 'phone number');
		testInvalidField(invalidSchedule, 'schedule');
		testInvalidField(invalidTimezone, 'timezone');
		testInvalidField(invalidEmail, 'email');

	});

})