var express = require('express');
var path = require('path');
var fs = require('fs');
var request = require('request');
var helpers = require('./helpers');

var PORT = process.env.PORT || 8889;

function makeHash (email, salt) {
  var sha = require('crypto').createHash('sha256');
  return 'sha256$' + sha.update(email + salt).digest('hex');
}

function buildAssertion(request, response, next){
  request.assertion = helpers.defaults({ recipient: request.query.email }, defaultAssertion);
  if (request.query.override) {
    try {
      var values = JSON.parse(decodeURIComponent(request.query.override));
      request.assertion = helpers.override(request.assertion, values);
      next();
    }
    catch (err) {
      console.log("Error parsing override values:", err);
      response.json({ msg: err.message }, 400);
    }
  }
  else {
    next();
  }
}

function proxyResponse(res, err, bpcRes, body) {
  if (err) return res.send(502);
  return res.send({
    body: body,
    statusCode: bpcRes.statusCode,
    headers: {
      'www-authenticate': bpcRes.headers['www-authenticate']
    }
  });
}

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "static")));

var defaultAssertion = JSON.parse(fs.readFileSync(path.join(__dirname, 'defaultAssertion.json')));

app.post('/refresh', function(req, res) {
  request.post({
    url: req.body.api_root + '/token',
    json: {
      grant_type: "refresh_token",
      refresh_token: req.body.refresh_token
    },
    timeout: 10000
  }, proxyResponse.bind(null, res));
});

app.post('/issue', function(req, res) {
  var b64Token = new Buffer(req.body.access_token).toString('base64');
  request.post({
    url: req.body.api_root + '/issue',
    headers: {'authorization': 'Bearer ' + b64Token},
    json: {badge: req.body.assertion},
    timeout: 10000
  }, proxyResponse.bind(null, res));
});

app.get('/raw.json', buildAssertion, function (request, response) {
  return response.send(request.assertion);
});

app.get('/hashed.json', buildAssertion, function (request, response) {
  var salt = 'yah';
  var assertion = request.assertion;
  assertion.recipient = makeHash(assertion.recipient, salt);
  assertion.salt = salt;
  return response.send(assertion);
});

app.get('/invalid.json', buildAssertion, function (request, response) {
  return response.send({
    recipient: request.query.email||'brian@mozillafoundation.org',
    evidence: '/whatever.html',
    expires: '2040-08-13',
    issued_on: '2011-08-23'
  });
});

if (!module.parent) {
  console.log("Listening on port", PORT);
  app.listen(PORT);
} else {
  module.exports = app;
}
