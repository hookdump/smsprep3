var should 		= require("should")
var basepath 	= '../';
var keep		= false;
var testStudent	= require('./assets/testStudent.js');

var Core 		= require(basepath + 'apps/smsprep-core/modules/core.js');

describe('smsprep-core service', function() {
	global.beQuiet 	= true;
	var Lib 		= require(basepath + 'lib/wrapper');
	var curStudent 	= null;

	Core.init(Lib);

	beforeEach(function(done) {
		Lib.Student.upsertStudent({externalId: 'U001', partner: 'TEST'}, testStudent, 'start', function(err, doc) {
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
	
	it('process incoming messages', function() {
		Core.incomingMessage("99876543210", "HELLO", function(err, result) {
			should.not.exist(err);
			should.exist(result);

			result['success'].should.be.true;
		});
	});

	it('handle incoming messages from unknown numbers', function() {
		Core.incomingMessage("91111111111", "HELLO", function(err, result) {
			should.exist(err);
			should.not.exist(result);

			
		});
	});

})
