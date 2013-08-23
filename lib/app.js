var express = require('express');

exports.build = function(options) {
  options = options || {};

  var app = express();

  app.get('/', function(req, res, next) {
    return res.send('HELLO WORLD');
  });

  return app;
}
