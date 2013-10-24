$(function () {

	var init = function() {
	};

	$('.del_student').click(function(ev) {
		ev.preventDefault();
		var answer = confirm("Are you sure you want to delete this user?");
		if (!answer) {
			return false;
		}
	});

	init();

});