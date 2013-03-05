var mainController = function(app, config, lib, passport) {
  console.log('loading main controller...');

  // Dashboard ----------------------------
  app.get('/dashboard', function(req, res) {
    var info = {};
    res.render('dashboard', { title: config.title, cur_section: "dashboard", info: info });  
  });

  // Students ----------------------------
  app.get('/students', function(req, res) {
    var info = {};
    res.render('students', { title: config.title, cur_section: "students", info: info });  
  });

}


var mainIo = function(socket) {
  return true;
}

module.exports.web = mainController;
module.exports.io  = mainIo;