var should 		= require("should")
var _ 			= require("underscore")
var basepath 	= '../';
var keep		= true;

var httpConnect = function(myMethod, myPath, postdata, callback) {
	var http = require('http');
	var body='';
	var options = {
		// hostname: 'sms.smsprep.local',
		// port: 80,
		hostname: 'localhost',
		port: 8202,
		path: myPath,
		method: myMethod,
		headers: {
			'Cookie': "cookie",
			'Content-Type': 'text/xml',
			// 'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postdata)
		}
	};

	var request = http.request(options, function(response) {
		response.on('data', function (chunk) {
			body += chunk;
		});
		
		response.on('end',function() {
			if (response.statusCode == 200) {
				return callback(null, body);
			} else {
				return callback(new Error('error! response code = ' + response.statusCode));
			}
		});
	});

	request.on('error', function(err) {
		return callback(err);
	});

	request.write(postdata);
	request.end();
}

describe('sms-interface', function() {
	var Lib = require(basepath + 'lib/wrapper');
	
	describe('service', function() {
		it('should be online', function(done) {
			httpConnect('GET', '/', 'TEST', function(err, data) {
				done();	
			});
		});
	});
	

	describe('slooce integration', function() {
		it('listens to incoming messages', function(done) {
			var xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><message id='1320192341004-1320387794654'><user>12333333331</user><keyword>SPTRIAL</keyword><content>N</content></message>";
			httpConnect('POST', '/slooce-connection', xml, function(err, data) {
				done(err);	
			});
			
		});
	});



})