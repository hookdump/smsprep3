$(document).ready(function() {

  var alreadyConnected = false;

  // IO Socket
  console.log('connecting to io socket (2)...');
  var socket = io.connect(null);
  socket.on('connect', function (data) {
    console.log('io socket connected!');
  });

  if ( $(".page_homepage").is("*") ) {
    console.log("smsprep@homepage");
  }

  if ( $(".page_dashboard").is("*") ) {
    console.log("smsprep@dashboard");

    socket.on('handshake', function (data) {
      console.log(data);
      socket.emit('awesomeness', { my: 'data' });
    });  
  }

  if ( $("#admin_content_detail").is("*") ) {
    console.log("smsprep@content_detail");  

    $("#questions_list li").each(function() {
    	var listItem = this;
    	$(listItem).find("a").click(function(ev){
    		ev.preventDefault();
    		$(listItem).find('.qdetails').slideToggle('fast');
    	});

      $(listItem).find("em").click(function(ev) {
        ev.preventDefault();
        var curLesson = $('#current_lesson').text();
        var curQuestion = $(this).text();
        var route = '/content/' + curLesson + '/' + curQuestion;
        window.location = route;
      });
    	
    });
  }

  if ( $("#admin_content_import").is("*") ) {
    console.log("smsprep@content_import");  

    var file = $('#import_filename').text();
    console.log("processing " + file);

    socket.on('connect', function (data) {

      if (!alreadyConnected) {
        // don't trigger import on socket reconnection
        socket.emit('content.import', {import_filename: file});
        alreadyConnected = true;
      }

      socket.on('content.import.progress', function (data) {
        var progress = data.val + '%';
        var msg = data.msg;

        console.log('received progress: ' + progress);
        $('#import_progressbar .bar').width(progress);

        if (msg === '%') msg = 'Importing questions... ' + progress;
        if (msg != null) {
          $('#import_msg').text(msg);
        }
      });

      socket.on('content.import.questions', function (d) {
        _.each( d.data , function(question_data, id) {
          var newTd = '<tr><td class="td1">' + id + '</td><td class="td2">' + question_data.t + '</td>';
          newTd += '<td class="td3">' + question_data.s + '</td></tr>';
          $('#import_tbody').append(newTd);
        });
      });

      socket.on('content.import.finished', function (data) {

        setTimeout(function() {
          $('#import_progressbar').slideUp('fast', function() {
            $('#import_msg').removeClass('alert-info').addClass('alert-success').text('Import finished!');  


          });
        }, 500);
        
      });
    });
  }

});
