var adminController = function(app, config, lib, passport) {
  log.loading('admin controllers');

  // Dashboard ----------------------------
  app.get('/admin', function(req, res) {

    if (req.user) {

      var info = {};
      lib.CronDelivery.getLast(function(err, lastCrons) {
        info.lastCrons = lastCrons;
        res.render('admin', { title: config.title, cur_section: "admin", info: info });  
      });

    } else {

      res.redirect('/login');

    }


    
  });
}

var adminIo = function(socket) {
  return true;
}

module.exports.web = adminController;
module.exports.io  = adminIo;