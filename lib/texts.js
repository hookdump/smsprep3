module.exports = {
	getMessage: function(type, student) {
		var str = '';

		if (type === '*stop') {
			str = 'Stopped!';
		}

		if (type === '*welcome') {
			str = 'Welcome to ePrep SMS Service. Reply CONFIRM to get started.\nAt any time, send HELP for help or STOP to end.\nInfo: eprep.com\nMsg+DataRatesMayApply';
		}

		return str;
	}
};