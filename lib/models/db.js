var mongoose    = require('mongoose');
var db          = null;
var currentConf = require('../../conf/currentConf.js');

function create() {
  var self = this;
  var dbserver = currentConf.connections.mongo;

  log.database('[db] connecting to MongoDB on ' + dbserver);
  this.connection = mongoose.createConnection(dbserver);

  this.connection.on('error', function (err) {
    log.error("connecting to mongoDB", err);
    process.exit();
    // throw err;
  });

  this.connection.once('open', function () {
    self.ready = true;
    log.database('[db] connected to MongoDB');
  });

  db = this.connection;
  return db;
}

function MongooseConnection() {
  this.ready = false;
  return { create: create };
}

module.exports = db ? db : new MongooseConnection().create();
