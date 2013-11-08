module.exports = {
	getMessage: function(type, student) {
		var str = '';

		if (type === '*stop') {
			str = "You've opted out of smsPREP. You'll receive no more msgs/charges.\n\nNeed help? Contact us at team@smsprep.com";
		}

		if (type === '*help') {
			if (student.confirmed) {
				str = 'Reply:\nN=new question\nSTOP=stop service\n\nConfused or have a question?\nContact us at team@smsprep.com\n\nMsg+DataRatesMayApply';
			} else {
				str = 'Reply:\nCONFIRM=confirm your phone\nSTOP=stop service\n\nConfused or have a question?\nContact us at team@smsprep.com\n\nMsg+DataRatesMayApply';
			}
			
		}

		if (type === '*welcome') {
			str = 'Welcome to smsPREP! Reply CONFIRM to get started.\nAt any time, send HELP for help or STOP to end.\nInfo: smsprep.com\nMsg+DataRatesMayApply';
		}

		return str;
	}
};