var mainController = function(app, config, lib, passport) {
  log.loading('main controllers');

  // Dashboard ----------------------------
  app.get('/dashboard', function(req, res) {
    var info = {};

    lib.CronDelivery.getLast(function(err, lastCrons) {
    	info.lastCrons = lastCrons;
    	res.render('dashboard', { title: config.title, cur_section: "dashboard", info: info });  
    });
    
  });

}


var mainIo = function(socket) {
  return true;
}

module.exports.web = mainController;
module.exports.io  = mainIo;