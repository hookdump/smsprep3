var should = require("should")
var basepath = '../';
var keep		= false;

describe('Message model', function() {
	global.beQuiet = true;

	var Lib = require(basepath + 'lib/wrapper');
	var curMessage = null;

	beforeEach(function(done) {
		// add some test data    
		Lib.Message.create({from: 'smsprep', to: '12223334444', msg: 'hello world 1', test: true}, function(err, doc) {
			curMessage = doc;
			done();
		});
	});

	afterEach(function(done){
		if (keep) {
			done();
		} else {
			Lib.Message.remove({test: true}, function() { done(); });
		}		
	});
		
	it('create a new message', function() {
		Lib.Message.create({from: 'smsprep', to: '12223334444', msg: 'hello world 2', test: true}, function(err, created) {
			should.not.exist(err);
			should.exist(created);
			should.exist(created.from);
			should.exist(created.to);
			created['from'].should.equal('smsprep');
			created['to'].should.equal('12223334444');
			created['msg'].should.equal('hello world 2');
		});
	});

});