defineTests(['issuer-api'], function(IssuerAPI) {

  module('IssuerAPI');

  var BACKPACK_SERVER = 'http://beta.openbadges.org/issuer.js';

  function maybeSkip(testFunc) {
    return function() {
      if (QUnit.config.noExternalDeps) {
        ok(1, 'Skipped - relies on ' + BACKPACK_SERVER);
        start();
      }
      else {
        testFunc();
      }
    };
  }

  var serverMock = {
    get: function() {
      return 'foo';
    },
    issuerURL: function() {
      return BACKPACK_SERVER;
    }
  };

  asyncTest('loads issuer API onto page', 
    maybeSkip(function() {
      ok(!window.OpenBadges);
      var issuerAPI = new IssuerAPI();
      issuerAPI.on('success', function(){
        ok(window.OpenBadges);
        start();
      });
      issuerAPI.reloadFrom(serverMock);
    })
  );

  asyncTest('unloads issuer API', 
    maybeSkip(function() {
      var issuerAPI = new IssuerAPI();
      issuerAPI.on('success', function(){
        ok(window.OpenBadges);
        issuerAPI.unload();
        ok(!window.OpenBadges);
        start();
      });
      issuerAPI.reloadFrom(serverMock);
    })
  );

});
