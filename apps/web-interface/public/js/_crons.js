$(function () {

	var init = function() {

		var tpl = $('#cronRowTemplate');
		var tBody = $('#cronRows');

		for (i=0; i<24; i++) {

			var hours = [];


			var newRow = '<tr>';
			
			newRow += '<td>' + ((i-8+24)%24) + '</td>';
			newRow += '<td>' + ((i-7+24)%24) + '</td>';
			newRow += '<td>' + ((i-6+24)%24) + '</td>';
			newRow += '<td>' + ((i-5+24)%24) + '</td>';
			newRow += '<td class="nocron">' + (i) + ':00</td>';
			newRow += '</tr>';
			$(tBody).append(newRow);

		}

		var cronHours = ['10','14','17','20'];
		var cronNames = ['morning', 'afternoon', 'evening', 'night'];
		$('#cronRows td').each(function(index, el) {
			if (!$(el).hasClass('nocron')) {
				var txt = $(el).text();
				var myindex = cronHours.indexOf(txt);
				if (myindex > -1) {
					$(el).text(cronNames[myindex]);
				} else {
					$(el).text('');
				}
			}
		});
		

	};

	init();

});