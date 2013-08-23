var express = require('express');
var clientSessions = require('client-sessions');

var template = require('./template');
var paths = require('./paths');

exports.build = function(options) {
  options = options || {};

  var app = express();

  app.use(express.static(paths.staticDir));
  if (options.debug)
    app.use('/test', express.static(paths.staticTestDir));

  app.use(express.bodyParser());
  app.use(clientSessions({
    cookieName: 'session',
    secret: options.cookieSecret,
    duration: options.cookieDuration ||
              30 * 24 * 60 * 60 * 1000, // defaults to 30 days
  }));

  template.express(app, {
    debug: options.debug,
    extraTemplateLoaders: options.extraTemplateLoaders
  });

  if (options.defineExtraMiddleware) options.defineExtraMiddleware(app);

  app.get('/', function(req, res) {
    return res.render('layout.html');
  });

  if (options.defineExtraRoutes) options.defineExtraRoutes(app);

  app.use(function(err, req, res, next) {
    if (typeof(err.status) == 'number')
      return res.type('text/plain').send(err.status, err.message);
    process.stderr.write(err.stack);
    res.send(500, 'Sorry, something exploded!');
  });

  return app;
}
