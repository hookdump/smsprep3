var myController = function(app, config, lib, passport) {
  log.loading('student controllers');

  // Students ----------------------------
  app.get('/students', lib.Utils.requireRole('admin'), function(req, res) {
    lib.Student.listAll(function(err, myList) {
    	res.render('students', { title: config.title, cur_section: "students", students: myList });
    });
  });
  
}


var myIo = function(socket) {
  return true;
}

module.exports.web = myController;
module.exports.io  = myIo;