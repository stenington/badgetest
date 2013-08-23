var _ = require('underscore');
var request = require('supertest');

var badgetest = require('../..');

exports.app = function(options) {
  options = _.defaults(options || {}, {
    cookieSecret: 's3cret'
  });

  return badgetest.app.build(options);
};

exports.request = function(options) {
  var app = exports.app(options);

  return request(app);
};
