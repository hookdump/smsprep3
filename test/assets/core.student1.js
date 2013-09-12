var now = new Date();
var tStudent = {
	phone: 		'89999990001'
	, lessons: 	['AAA', 'BBB', 'CCC']
	, schedule: 'morning'
	, email: 	'foo@bar.com'
	, fullname: 'John Doe'
	, timezone: 'EST'
	, joined: 	now
};

module.exports = {
	data: tStudent
	, query: {externalId: 'U001', partner: 'TEST.CORE'}
};