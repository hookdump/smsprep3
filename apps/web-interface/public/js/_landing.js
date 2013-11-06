$(function () {

	var usingAnalytics = $('#using_analytics').is('*');
	if (!usingAnalytics) {
		console.log('NOT using analytics');
		function _trackEvent(a,b) {
			console.log('noop!');
		};
	} else {
		console.log('using analytics');
	}

	$('.sel2').select2({width: 'element'});
	$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

	$('.cta_button').click(function(e) {
		e.preventDefault();
		console.log('cta click!');
		_trackEvent('landing', 'initial_cta_click');

		$('.main_container').removeClass('phonebg').addClass('phonebg2');
		$('.cta_panel').slideUp('fast', function() {
			$('.signup_form').slideDown('fast');

		})
	});

	$('#formsubmit').click(function(ev) {
		console.log('form submit!');
		_trackEvent('landing', 'account_creation');
	});

	$('.cancelBtn').click(function() {
		$('.main_container').removeClass('phonebg2').addClass('phonebg');
		$('.signup_form').slideUp('fast', function() {
			$('.cta_panel').slideDown('fast');

		})
	});
	// var dateLimit = new Date(2013, 10, 10); 
	// $('#myCountdown').countdown({until: dateLimit});
});