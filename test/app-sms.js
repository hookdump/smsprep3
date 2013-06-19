var should 		= require("should");
var request 	= require("request");
var _ 			= require("underscore");
var basepath 	= '../';
var keep		= true;

var smsRoot		= 'http://localhost:8202/';
var smsURL		= 'http://localhost:8202/slooce-connection';

var buildXml = function (phone, keyword, msg, command) {
	var buffer = "";
	buffer += "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
	buffer += "<message id='1320192341004-1320387794654'>";

	buffer += "<user>" + phone + "</user>";
	buffer += "<keyword>" + keyword + "</keyword>";

	if (msg) 		buffer += "<content>" + msg + "</content>";
	if (command) 	buffer += "<command>" + command + "</command>";

	buffer += "</message>";

	return buffer;
}

describe('sms-interface service', function() {
	var Lib = require(basepath + 'lib/wrapper');
	
	describe('service', function() {
		it('should be online', function(done) {
			request.get({url: smsRoot}, function (err, response, body) {
				should.not.exist(err);
				response.statusCode.should.equal(200);
				done();	
			});
		});
	});
	
	describe('slooce integration', function() {
		it('listens to incoming messages', function(done) {
			var xml = buildXml("99999999999", "SPTRIAL", "N");
			request.post({url: smsURL, body: xml}, function (err, response, body) {
				should.not.exist(err);
				response.statusCode.should.equal(200);

				done();
			});
		});
	});
});

