var should = require('should');
var sinon = require('sinon');

var request = require('./lib/util').request;

describe('app', function() {
  it('reports errors', function(done) {
    request({testRoutes: {
      'GET /forced-error': function(req, res, next) {
        sinon.stub(process.stderr, 'write');
        next(new Error('omg kaboom'));
      }
    }})
      .get('/forced-error')
      .expect('Sorry, something exploded!')
      .expect(500, function(err) {
        process.stderr.write.calledWithMatch('omg kaboom').should.eql(true);
        process.stderr.write.restore();
        done(err);
      });
  });

  it('reports http errors', function(done) {
    request({testRoutes: {
      'GET /forced-error': function(req, res, next) {
        sinon.stub(process.stderr, 'write');
        var error = new Error('NOPE');
        error.status = 404;
        next(error);
      }
    }})
      .get('/forced-error')
      .expect('NOPE')
      .expect(404, function(err) {
        process.stderr.write.called.should.eql(false);
        process.stderr.write.restore();
        done(err);
      });
  });
});