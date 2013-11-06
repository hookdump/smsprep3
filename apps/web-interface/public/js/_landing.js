$(function () {

	$('.sel2').select2({width: 'element'});
	$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

	$('.cta_button').click(function(e) {
		e.preventDefault();

		$('.main_container').removeClass('phonebg').addClass('phonebg2');
		$('.cta_panel').slideUp('fast', function() {
			$('.signup_form').slideDown('fast');

		})
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