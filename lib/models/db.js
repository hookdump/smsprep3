var mongoose = require('mongoose');
var db = null;

function create() {
  var self = this;
  var myenv = process.env.NODE_ENV || 'development';
  var dbserver = '';

  if (myenv === 'test') {
    dbserver = 'mongodb://localhost/smsprep3_test';

  } else if (myenv === 'production') {
    dbserver = 'mongodb://smsprepdb:soke6540@linus.mongohq.com:10032/smsprep3';

  } else {
    dbserver = 'mongodb://localhost/smsprep3';

  }

  log.magenta('[db] connecting to MongoDB on ' + dbserver);
  this.connection = mongoose.createConnection(dbserver);

  this.connection.on('error', function (err) {
    log.error("connecting to mongoDB", err);
    process.exit();
    // throw err;
  });

  this.connection.once('open', function () {
    self.ready = true;
    log.magenta('[db] connected to MongoDB');
  });

  db = this.connection;
  return db;
}

function MongooseConnection() {
  this.ready = false;
  return { create: create };
}

module.exports = db ? db : new MongooseConnection().create();
