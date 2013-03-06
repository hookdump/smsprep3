var should = require("should")
var basepath = '../';

describe('User', function() {

	var Lib = require(basepath + 'lib/wrapper');
	var curUser = null;
		
	beforeEach(function(done) {
		// add some test data    
		Lib.User.createUser("test_user", "pass", function(err, doc, msg) {
			curUser = doc;
			done();
		});
	});

	afterEach(function(done){
		// delete all the user records    
		Lib.User.remove({}, function() { done(); });
	});

		
	it('create a new user', function() {
		Lib.User.createUser("test_user_2", "pass", function(err, created, msg) {
			should.not.exist(err);
			created['username'].should.equal("test_user_2");
			created['password'].should.equal("pass");
		});
	});

	it('forbid registering existing username', function() {
		Lib.User.createUser("test_user", "pass", function(err, created, msg) {
			should.not.exist(err);
			created.should.be.false;
			msg.should
		});
	});

})
