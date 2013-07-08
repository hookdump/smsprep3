var should = require("should")
	, moment = require("moment");

var basepath = '../';
var keep		= false;

describe('Time Management', function() {
	global.beQuiet = true;
	
	var Lib = require(basepath + 'lib/wrapper');
	
	it('load moment.js library', function() {
		moment().format();
	});

	it('format dates properly', function() {
		
		var d = new Date();
		var mom = moment(d);

		var niceDate = mom.format('M/D/YYYY');
		
		var curr_date = d.getDate();
	    var curr_month = d.getMonth() + 1; //Months are zero based
	    var curr_year = d.getFullYear();
	    var rawDate = curr_month + '/' + curr_date + '/' + curr_year;

		rawDate.should.equal(niceDate);
	});

	

})
