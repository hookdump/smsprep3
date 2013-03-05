$(document).ready(function() {

  // IO Socket
  console.log('connecting to io socket...');
  var socket = io.connect('http://localhost');
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
    	
    });
  }

});
