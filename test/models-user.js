var should = require("should")
var basepath = '../';
var keep		= false;

describe('User model', function() {
	global.beQuiet = true;
	
	var Lib = require(basepath + 'lib/wrapper');
	var curUser = null;

	beforeEach(function(done) {
		// add some test data    
		Lib.User.createUser("test", "foo", function(err, doc, msg) {
			curUser = doc;
			done();
		});
	});

	afterEach(function(done){
		if (keep) {
			done();
		} else {
			Lib.User.remove({}, function() { done(); });
		}		
	});

		
	it('create a new user', function() {
		Lib.User.createUser("test2", "foo", function(err, created, msg) {
			should.not.exist(err);
			should.exist(created);
			should.exist(created.username);
			should.exist(created.password);
			created['username'].should.equal("test2");
			created['password'].should.equal("foo");
		});
	});

	it('validate password', function() {
		curUser.validPassword("foo").should.be.true;
		curUser.validPassword("bar").should.be.false;
	})

	it('forbid duplicated usernames', function() {
		Lib.User.createUser("test", "foo", function(err, created, msg) {
			should.not.exist(err);
			created.should.be.false;
			msg.should
		});
	});

})
