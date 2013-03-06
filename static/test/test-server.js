defineTests(['server'], function(Server) {
  module('Server');

  test('issuerURL returns url for issuer.js', function(){
    equal((new Server({ name: 'foo', url: 'http://foo.com' })).issuerURL(),
      'http://foo.com/issuer.js', 'when created with base url');
    equal((new Server({ name: 'foo', url: 'http://foo.com/' })).issuerURL(),
      'http://foo.com/issuer.js', 'when created with base url/');
    equal((new Server({ name: 'foo', url: 'http://foo.com/issuer.js' })).issuerURL(),
      'http://foo.com/issuer.js', 'when created with issuer.js url');
  });
});
