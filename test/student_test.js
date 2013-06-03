var should 		= require("should")
var _ 			= require("underscore")
var basepath 	= '../';
var keep		= false;

describe('Student', function() {
	var Lib = require(basepath + 'lib/wrapper');
	var curStudent = null;
	var testData = null;
		
	beforeEach(function(done) {
		// add some test data    
		var now = new Date();
		testData = {
			phone: 		'19876543210'
			, lessons: 	['AAA', 'BBB', 'CCC']
			, schedule: 'morning'
			, email: 	'foo@bar.com'
			, fullname: 'John Doe'
			, timezone: 'EST'
			, joined: 	now
		};

		Lib.Student.upsertStudent({externalId: 'U001', partner: 'TEST'}, testData, 'start', function(err, doc) {
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
			Lib.Student.upsertStudent({externalId: 'U001', partner: 'TEST'}, testData2, 'edit', function(err, doc) {
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
			curStudent2.email.should.equal( testData.email );
		});
	});

	describe('data validation', function() {
		var invalidPhone = {phone: '1234'};
		var invalidEmail = {email: 'foo'};
		var invalidSchedule = {schedule: 'foo'};
		var invalidTimezone = {timezone: 'foo'};

		var testInvalidField = function(query, title) {
			it(title + ' validation', function(done) {
				Lib.Student.upsertStudent({externalId: 'U001', partner: 'TEST'}, query, 'edit', function(err, updatedStudent) {
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