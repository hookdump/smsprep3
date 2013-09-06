$(function () {

	if (!$('#messages_page').is('*')) return;

	var lastStamp = 0;
	var validPhone = true;
	var testPhone = null;

	var renderedMsgs = [];

	console.log('initializing messages page...');
	refreshMessages();
	validatePhone();
	showEmulating(false);

	setInterval(function() {
		refreshMessages();
	}, 3000);

	function refreshMessages() {
		_fetchMessages(lastStamp, null);
	}

	function _emulateMessage(from, msg, cb) {
		var endpoint = '/admin/messages/emulate';
		var resultsDiv = $('.logMessages');

		console.log('emulating #' + from + ': ' + msg);
		var myData = {
			phone: from
			, msg: msg
			, lastStamp: lastStamp
		};
		var myOptions = {
			type: 'POST'
			, url: endpoint
			, data: myData
			, success: function(data) {
				return cb(null, data.messages);
			}
		};
		$.ajax(myOptions);
	}

	function _fetchMessages(stamp, testNumber) {
		var endpoint = '/admin/messages/load';

		console.log('fetching messages (lastStamp=' + lastStamp + ')');

		// stamp: null => stamp: 0
		if (!stamp) stamp = 0;
		var myData = {
			lastStamp: stamp
		};

		if (testNumber) {
			myData['number'] = testNumber;
		var resultsDiv = $('.logTesting');
		}

		var myOptions = {
			type: 'GET'
			, url: endpoint
			, data: myData
			, success: function(data) {
				renderMessages(data.messages, testNumber);				
			}
		};
		$.ajax(myOptions);
	}

	function renderMessages(msgs, specificNumber) {
		var resultsDiv = $('.logMessages');
		var testingDiv = $('.logTesting');
		var avoidGlobal = false;
		var avoidTesting = false;
		
		var tplBySmsprep = $('.templateItems').find('.by-me').clone();

		msgs.forEach(function(msg) {
			console.log(msg);
			var involvedNumber = 0;

			var myid = msg._id;
			if (renderedMsgs.indexOf(myid) > -1) {
				console.log('avoiding rendering repeated message!');
				avoidGlobal = true;
				avoidTesting = true;
				if (specificNumber) avoidTesting = false;
			} else {
				renderedMsgs.push(myid);
			}

			if (msg.from == 'smsprep') {
				var tpl = $('.templateItems').find('.by-me').clone().hide();
				
				var text = msg.msg.replace(/\n/g, '<br />');
				$(tpl).find('.body').html( text );
				
				$(tpl).find('.to-number').text( msg.to );
				involvedNumber = msg.to;
				
				var when = moment(msg.created);
				var valwhen = +when;
				if (valwhen > lastStamp) lastStamp = valwhen;

				$(tpl).find('.time-ago').text( when.fromNow() );

			} else {
				var tpl = $('.templateItems').find('.by-other').clone().hide();
				
				var text = msg.msg.replace('\n', '<br />');
				$(tpl).find('.body').html( text );

				$(tpl).find('.from-number').text( msg.from );
				involvedNumber = msg.from;
				
				var when = moment(msg.created);
				var valwhen = +when;
				if (valwhen > lastStamp) lastStamp = valwhen;

				$(tpl).find('.time-ago').text( when.fromNow() );
			}

			// clone for Testing?
			if ((involvedNumber == testPhone) && (!avoidTesting)) {
				var tpl2 = $(tpl).clone().hide().prependTo(testingDiv);
				$(tpl2).slideDown('fast');
			}

			// we can add to global:
			if (!avoidGlobal && !specificNumber) {
				$(tpl).prependTo(resultsDiv);
				$(tpl).slideDown('fast');
			}



			
		});
	}

	$('.testingConfig_phone').keyup(function() {
		validatePhone();
	});
	$('.testingConfig_phone').change(function() {
		validatePhone();
	});

	$('.testingConfig_start').click(function(ev) {
		ev.preventDefault();

		// set phone!
		showEmulating(true);
		var phone = $('.testingConfig_phone').val();
		testPhone = phone;

		$('.testingMessage_msg').val('');
		$('.testPhone').text( testPhone );
		$('.testingConfig').fadeOut('fast', function() {
			$('.testingMessage').fadeIn('fast', function() {
				
				_fetchMessages(0, testPhone);
				showEmulating(false);

			});
		});	
	});

	function enableControl(obj, enable) {
		if (enable) {
			$(obj).removeClass('disabled').removeAttr('disabled');
		} else {
			$(obj).addClass('disabled').attr('disabled', 'disabled');
		}
	}

	$('.testingMessage_send').click(function(ev) {
		var btn = $('.testingMessage_send');
		ev.preventDefault();

		enableControl(btn, false);
		$(btn).text('Sending...');

		var myphone = testPhone;
		var mymsg = $('.testingMessage_msg').val();
		$('.testingMessage_msg').val('')

		showEmulating(true);
		_emulateMessage(myphone, mymsg, function(err, msgs) {
			
			enableControl(btn, true);
			$(btn).text('Send');

			showEmulating(false);

			console.log('message emulated successfully');
			renderMessages(msgs);

		});
	});

	function showEmulating(display) {
		/*
		if ($('.emulateLoading').is(':animated')) {
			$('.emulateLoading').stop();
		}
		*/

		if (display) {
			$('.emulateLoading').fadeIn('fast');
		} else {
			$('.emulateLoading').fadeOut('fast');
		}
	}

	function validatePhone() {
		var phone = $('.testingConfig_phone').val();
		var valid = false;
		if (phone.length == 11) {
			if (phone[0] == '9' || phone[0] == '1') {
				valid = true;
			}
		}

		if (valid) {
			if (!validPhone) {
				console.log('wasnt valid! enable!');
				$('.testingConfig_start').removeAttr('disabled').removeClass('disabled');
				validPhone = true;
			} else {
				console.log('was valid :3');
			}
		} else {
			if (validPhone) {
				console.log('disabling');
				$('.testingConfig_start').attr('disabled', 'disabled').addClass('disabled');
				validPhone = false;
			}
		}

		console.log(phone + ' - ' + valid);
	}



});