var should = require("should")
var basepath = '../';
var keep		= false;

describe('CronDelivery model', function() {
	global.beQuiet = true;

	var Lib = require(basepath + 'lib/wrapper');
	var curMessage = null;

	afterEach(function(done){
		if (keep) {
			done();
		} else {
			Lib.CronDelivery.remove({}, function() { done(); });
		}		
	});

		
	it('create a new cron delivery', function(done) {
		var deliveryData = {timezone: 'PST', schedule: 'morning', count: 100};
		
		Lib.CronDelivery.create(deliveryData, function(err, created) {
			should.not.exist(err);
			should.exist(created);
			should.exist(created.timezone);
			should.exist(created.schedule);
			should.exist(created.count);
			/*
			created['from'].should.equal('smsprep');
			created['to'].should.equal('12223334444');
			created['msg'].should.equal('hello world 2');
			*/

			done();
		});
	});

});