var mongoose = require('mongoose');

var db;

function create () {
  var self = this;
  // this.connection = mongoose.createConnection('mongodb://smsprepdb:soke6540@linus.mongohq.com:10032/smsprep3');
  this.connection = mongoose.createConnection('mongodb://localhost/smsprep3');

  this.connection.on('error', function (err) {
    throw err;
  });
  this.connection.once('open', function () {
    self.ready = true;
  });
  db = this.connection;
  return db;
}

function MongooseConnection () {
  this.ready = false;
  return { create: create };
}

module.exports = db ? db : new MongooseConnection().create();
