var express = require('express');
var clientSessions = require('client-sessions');

exports.build = function(options) {
  options = options || {};

  var app = express();

  app.use(express.bodyParser());
  app.use(clientSessions({
    cookieName: 'session',
    secret: options.cookieSecret,
    duration: options.cookieDuration ||
              30 * 24 * 60 * 60 * 1000, // defaults to 30 days
  }));

  app.get('/', function(req, res, next) {
    return res.send('HELLO WORLD');
  });

  return app;
}
