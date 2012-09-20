var express = require('express');
var path = require('path');
var fs = require('fs');
var helpers = require('./helpers');

function makeHash (email, salt) {
  var sha = require('crypto').createHash('sha256');
  return 'sha256$' + sha.update(email + salt).digest('hex');
}

var app = express.createServer();
app.use(express.static(path.join(__dirname, "static")));

var defaultAssertion = JSON.parse(fs.readFileSync(path.join(__dirname, 'defaultAssertion.json')));

app.use(function buildAssertion(request, response, next){
  request.assertion = helpers.defaults({ recipient: request.query.email }, defaultAssertion);
  if (request.query.override) {
    try {
      var values = JSON.parse(decodeURIComponent(request.query.override));
      request.assertion = helpers.override(request.assertion, values);
      next();
    }
    catch (err) {
      console.log("Error parsing override values:", err);
      response.json(err.message, 400);
    }
  }
  else {
    next();
  }
});
  
app.get('/raw.json', function (request, response) {
  return response.send(request.assertion);
});

app.get('/hashed.json', function (request, response) {
  var salt = 'yah';
  var assertion = request.assertion;
  assertion.recipient = makeHash(assertion.recipient, salt);
  assertion.salt = salt;
  return response.send(assertion);
});

app.get('/invalid.json', function (request, response) {
  return response.send({
    recipient: request.query.email||'brian@mozillafoundation.org',
    evidence: '/whatever.html',
    expires: '2040-08-13',
    issued_on: '2011-08-23'
  });
});

if (!module.parent) {
  console.log(process.pid);
  app.listen(8889);
} else {
  module.exports = app;
}
