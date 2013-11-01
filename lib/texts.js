module.exports = {
	getMessage: function(type, student) {
		var str = '';

		if (type === '*stop') {
			str = "You've opted out of ePrep SMS Service. You'll receive no more msgs/charges.\n\nNeed help? Contact us at support@eprep.com";
		}

		if (type === '*help') {
			if (student.confirmed) {
				str = 'Reply:\nN=new question\nSTOP=stop service\n\nConfused or have a question?\nContact us at support@eprep.com\n\nMsg+DataRatesMayApply';
			} else {
				str = 'Reply:\nCONFIRM=confirm your phone\nSTOP=stop service\n\nConfused or have a question?\nContact us at support@eprep.com\n\nMsg+DataRatesMayApply';
			}
			
		}

		if (type === '*welcome') {
			str = 'Welcome to ePrep SMS Service. Reply CONFIRM to get started.\nAt any time, send HELP for help or STOP to end.\nInfo: eprep.com\nMsg+DataRatesMayApply';
		}

		return str;
	}
};