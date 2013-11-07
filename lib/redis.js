var redis = require('redis'),
    url = require('url'),
    currentConf = require('../conf/currentConf.js');

function Cache() {
  log.cache('[redis] creating redis client...');

  this.defaultDB = '1';

  if (currentConf.connections.redis) {
    currentRedisURL = currentConf.connections.redis;
    var parsedURL = url.parse(currentRedisURL);

    log.cache('[redis] connecting to: ' + currentRedisURL);
    this.client = redis.createClient(parsedURL.port, parsedURL.hostname);
    this.client.select(this.defaultDB);

    if (parsedURL.auth) {
      log.cache('[redis] authenticating redis: ' + parsedURL.auth.split(":")[1]);
      this.client.auth(parsedURL.auth.split(":")[1]);
    } else {
      log.cache('[redis] proceeding with no redis authentication...');
    }
  }

  this.client.on("error", function(err) {
    log.red('[redis] redis error: ' + err);
  });

  var self = this;
  this.client.once("connect", function() {
    log.cache('[redis] redis connected!');
    
    self.client.get("dbname", function(err, reply) {
      self.initialized = true;
      log.cache('[redis] redis db ' + self.defaultDB + ' selected (' + reply + ')');
    });
  });
}

var cache = null;
module.exports = (cache !== null) ? cache : (cache = new Cache());