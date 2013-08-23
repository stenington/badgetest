var request = require('supertest');

var badgetest = require('../');

describe("app", function() {
  it("returns 'HELLO WORLD' at /", function(done) {
    request(badgetest.app.build())
      .get('/')
      .expect(200)
      .expect('HELLO WORLD')
      .end(done);
  });
});