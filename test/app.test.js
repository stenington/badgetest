var request = require('./lib/util').request;

describe("app", function() {
  it("returns 'HELLO WORLD' at /", function(done) {
    request()
      .get('/')
      .expect(200)
      .expect('HELLO WORLD')
      .end(done);
  });
});