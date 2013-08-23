var _ = require('underscore');

var testUtil = require('./lib/util');
var request = testUtil.request;

describe("template middleware", function() {
  it('auto-escapes template variables', function(done) {
    request({
      testRoutes: {
        'GET /escaping': function(req, res) {
          return res.render('escaping.html', {foo: '<script>'});
        }
      },
      testTemplates: {'escaping.html': 'hi {{foo}}'}
    })
      .get('/escaping')
      .expect('hi &lt;script&gt;')
      .expect(200, done);
  });

  it('defines response.render.SafeString', function() {
    testUtil.app().response.render.SafeString
      .should.be.a('function');
  });

  it('defines DOT_MIN in app.locals', function() {
    testUtil.app({debug: true}).locals.DOT_MIN
      .should.equal('');
    testUtil.app({debug: false}).locals.DOT_MIN
      .should.equal('.min');
  });
});

describe("layout.html", function() {
  function layoutRequest(options) {
    return request({
      testRoutes: {
        'GET /layout': function(req, res) {
          if (options.flash)
            req.flash.apply(req, options.flash);
          return res.render('layout.html');
        }
      },
      defineExtraMiddleware: function(app) {
        app.use(function(req, res, next) {
          _.extend(res.locals, options.resLocals);
          next();
        });
      }
    }).get('/layout');
  }

  it('displays flash message content', function(done) {
    layoutRequest({flash: ['info', '<hi']})
      .expect(/&lt;hi/)
      .end(done);
  });

  it('displays flash message category', function(done) {
    layoutRequest({flash: ['infoMessageCategory', 'yo']})
      .expect(/infoMessageCategory/)
      .end(done);
  });
});
