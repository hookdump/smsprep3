var bouncy      = require('bouncy');
var _           = require('underscore');
var currentConf = require('../../conf/currentConf.js');

var server = bouncy(function (req, res, bounce) {
    var reqHost = req.headers.host;
    var routed  = false;

    _(currentConf.services).each(function(service) {
        if (reqHost === service.domain) {
            routed = true;
            console.log('bouncing ' + service.domain + ' => ' + service.port);
            bounce(service.port);
        }
    });

    if (!routed) {
        console.log('host ' + reqHost + ' not found!');
        res.statusCode = 404;
        res.end('no such host');
    }

});
server.listen(80);