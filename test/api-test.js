var APIeasy = require('api-easy');
var assert = require('assert');
var path = require('path');

var PORT = 8890;

var app = require('../app');
app.listen(PORT);

function querify(obj){
  return encodeURIComponent(JSON.stringify(obj));
}

var suite = APIeasy.describe('Fakeissuer');

suite.use('localhost', PORT)
  .path('/raw.json')
    .get()
      .expect(200)
      .expect('should return json assertion', function(err, res, body){
        assert.include(res.headers, 'content-type');
        assert.match(res.headers['content-type'], /application\/json/);
        // check a few keys (non-comprehensive)
        var obj = JSON.parse(body);
        assert.include(obj, 'recipient');
        assert.include(obj, 'badge');
        assert.include(obj.badge, 'name');
        assert.include(obj.badge, 'issuer');
      })
      .expect('should return default assertion values', function(err, res, body){
        var obj = JSON.parse(body);
        // check a few values (non-comprehensive)
        assert.equal(obj.recipient, 'brian@mozillafoundation.org'); 
        assert.equal(obj.badge.name, 'Open Source Contributor'); 
      })
    .get('?email=')
      .expect(200)
      .expect('should return empty recipient', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, ''); 
      })
    .get('?email=foo')
      .expect(200)
      .expect('should return specified recipient', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, 'foo');
      })
    .get('?override=' + querify({ recipient: 'foo', badge: { name: 'bar' } }))
      .expect(200)
      .expect('should return assertion with overrides', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, 'foo');
        assert.equal(obj.badge.name, 'bar');
      })
    .get('?override=THISISINVALID')
      .expect(400)
      .expect({msg: "Unexpected token T"})
  .unpath()
  .path('/hashed.json')
    .get()
      .expect(200)
      .expect('should return json assertion', function(err, res, body){
        assert.include(res.headers, 'content-type');
        assert.match(res.headers['content-type'], /application\/json/);
        // check a few keys (non-comprehensive)
        var obj = JSON.parse(body);
        assert.include(obj, 'recipient');
        assert.include(obj, 'badge');
        assert.include(obj.badge, 'name');
        assert.include(obj.badge, 'issuer');
      })
      .expect('should return hashed recipient', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, 'sha256$b30452b3e9ea99152aef0d19cec2cd66408292f66fa13e32bef15ae08a1b86db');
      })
    .get('?email=foo')
      .expect(200)
      .expect('should return hashed recipient', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, 'sha256$2d425c21fcdcd46a3cfe45c599fa25e2b3a0b0b6fdf24ce6fa4d4836170bba9f');
      })
    .get('?override=' + querify({ recipient: 'foo' }))
      .expect(200)
      .expect('should return hashed recipient', function(err, res, body){
        var obj = JSON.parse(body);
        assert.equal(obj.recipient, 'sha256$2d425c21fcdcd46a3cfe45c599fa25e2b3a0b0b6fdf24ce6fa4d4836170bba9f');
      })
  .unpath()
  .export(module);
