var _ = require('underscore');
var request = require('supertest');

var badgetest = require('../..');

exports.app = function(options) {
  options = _.defaults(options || {}, {
    cookieSecret: 's3cret'
  });

  if (options.testRoutes) {
    var testRoutes = options.testRoutes;

    options.defineExtraRoutes = function(app) {
      Object.keys(testRoutes).forEach(function(route) {
        var parts = route.split(' ', 2);
        var method = parts[0].toLowerCase();
        var path = parts[1];

        return app[method](path, testRoutes[route]);
      });
    };
    delete options.testRoutes;
  }

  return badgetest.app.build(options);
};

exports.request = function(options) {
  var app = exports.app(options);

  return request(app);
};
