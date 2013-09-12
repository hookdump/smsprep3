/*
var redis = require('redis'),
    url = require('url'),
    currentConf = require('../conf/currentConf.js');

function Cache() {
  log.database('[db] creating redis client...');

  this.defaultDB = '1';

  if (currentConf.connections.redis) {
    currentRedisURL = currentConf.connections.redis;
    var parsedURL = url.parse(currentRedisURL);

    log.database('[db] connecting to: ' + currentRedisURL);
    this.client = redis.createClient(parsedURL.port, parsedURL.hostname);

    if (parsedURL.auth) {
      log.database('[db] authenticating redis: ' + parsedURL.auth.split(":")[1]);
      this.client.auth(parsedURL.auth.split(":")[1]);
    } else {
      log.database('[db] proceeding with no redis authentication...');
    }
  }

  this.client.on("error", function(err) {
    log.red('[db] redis error: ' + err);
  });

  var self = this;
  this.client.once("connect", function() {
    log.database('[db] redis connected! selecting db ' + self.defaultDB);
    self.client.select(self.defaultDB);
    self.client.get("dbname", function(err, reply) {
      self.initialized = true;
      log.database('[db] redis db ' + self.defaultDB + ' selected (' + reply + ')');
    });
  });
}

var cache = null;
module.exports = (cache !== null) ? cache : (cache = new Cache());

*/