$(function () {

	var init = function() {
	};

	$('.del_student').click(function(ev) {
		var answer = confirm("Are you sure you want to delete this user?");
		if (!answer) {
			ev.preventDefault();
			return false;
		}
	});

	init();

});