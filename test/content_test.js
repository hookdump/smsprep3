var should 		= require("should")
var _ 			= require("underscore")
var basepath 	= '../';
var keep		= false;

describe('Question', function() {
	var Lib = require(basepath + 'lib/wrapper');
	var curQuestion = null;
	var testData = null;
	var testOptions = null;
		
	beforeEach(function(done) {
		// add some test data    
		testOptions = [
			{
				text: 'I am right'
				, correct: true
			},
			{
				text: 'I am wrong'
				, correct: false
			}
		];
		testData = {
			text: 'What is this question?'
			, qoptions: testOptions
			, feedback: {
				correct: 'Congrats!'
				, incorrect: 'Oh no!'
			}
		};

		Lib.Content.Question.upsertQuestion('TEST001', testData, function(err, doc) {
			curQuestion = doc;
			done();
		});
	});

	afterEach( function(done) {
		if (keep) {
			done();
		} else {
			Lib.Content.Question.remove({}, function() { done(); });	
		}
	});

		
	describe('creation', function() {
		it('returns the created question', function() {
			should.exist(curQuestion);
		});
		
		it('the returned object is valid', function() {
			curQuestion.universalId.should.equal('TEST001');
			curQuestion.text.should.equal( testData.text );
			curQuestion.feedback.correct.should.equal( testData.feedback.correct );
			curQuestion.feedback.incorrect.should.equal( testData.feedback.incorrect );
			curQuestion.qoptions.should.have.length( testData.qoptions.length );
		});
	});

	describe('update', function() {
		var testData2 = {};
		testData2.text = 'My new question!?';
		var updatedQuestion = {};

		it('returns the updated question', function(done) {
			Lib.Content.Question.upsertQuestion('TEST001', testData2, function(err, doc) {
				updatedQuestion = doc;
				done();
			});
		});
		it('the returned object is valid', function() {
			updatedQuestion.universalId.should.equal('TEST001');

			// it has changed!
			updatedQuestion.text.should.equal( testData2.text );
			updatedQuestion.text.should.not.equal( curQuestion.text );

			// it has not changed!
			updatedQuestion.feedback.correct.should.equal( curQuestion.feedback.correct );
			updatedQuestion.feedback.incorrect.should.equal( curQuestion.feedback.incorrect );
			updatedQuestion.qoptions.should.have.length( curQuestion.qoptions.length );
		});
	});

})