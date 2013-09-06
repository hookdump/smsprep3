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

  if ( $("#admin_question_detail").is("*") ) {
    console.log("smsprep@question_detail");  

    // Lesson selection
    var lessonListUrl = '/';
    var selectionListUrl = '/';

    var sel2config = {
      width: 'element'
    };

    $("#sel_lessons").select2(sel2config);

    $(".cancel-button").click(function(ev) {
      ev.preventDefault();      
      window.location = $(".back-to-lesson").attr('href');
    });

    $(".save-button").click(function(ev) {
      ev.preventDefault();
      console.log('preparing to save...');

      // 1. Find all the answers
      var myAnswers = [];
      $(".options_container input").each(function(el) {
        var myAnswer  = {};
        var myText    = $(this).val();
        var isCorrect = $(this).prev("label").hasClass("qo_correct");

        myAnswer['text'] = myText;
        myAnswer['correct'] = isCorrect;

        myAnswers.push(myAnswer);
      });

      // 2. Find the question text
      var myQuestionText = $("#qtext").text();

      var updateObj = {};
      updateObj['text'] = myQuestionText;
      updateObj['qoptions'] = myAnswers;
      

      // 3. Lessons!
      var lessonsList = $('#sel_lessons').val().toString();
      var lessonsArray = lessonsList.split(',');
      updateObj['lessons'] = lessonsArray;

      // 4. Reset valid flag? perhaps instead of bool it should be a byte
      // updateObj['valid'] = false;

      // 5. Feedback!
      var myCorrectFeedback = $("#qcorrect_feedback").text();
      var myIncorrectFeedback = $("#qincorrect_feedback").text();
      updateObj['feedback'] = {
        'correct': myCorrectFeedback
        , 'incorrect': myIncorrectFeedback
      };

      var curLesson     = $('#info_lesson').text();
      var curQuestion   = $('#info_question').text();

      $.ajax({
        type: "POST",
        url: "/content/" + curLesson + "/" + curQuestion,
        data: { questionData: updateObj }
      }).done(function( msg ) {
        alert( "Data Saved: " + msg );
      });

    });


    $(".options_container label").each(function(el) {
      $(this).click(function(ev) {
        ev.preventDefault();

        // Clean up correct answer
        $(".qo_correct").removeClass("qo_correct").addClass("qo_incorrect");

        // Set current = correct
        $(this).removeClass("qo_incorrect").addClass("qo_correct");
        
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
