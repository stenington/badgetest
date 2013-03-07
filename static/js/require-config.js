var require = {
  baseUrl: 'js',
  shim: {
    'underscore': {
      exports: function() {
        return _.noConflict();
      }
    },
    'jquery': {
      exports: function() {
        return jQuery.noConflict();
      }
    },
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: function() {
        return Backbone.noConflict();
      }
    },
    'bootstrap-alert': {
      deps: ['jquery']
    },
    'md5': {
      exports: function() {
        return md5;
      }
    }
  },
  paths: {
    'backbone': '../vendor/backbone',
    'localStorage': '../vendor/backbone.localStorage',
    'jquery': '../vendor/jquery-1.9.1',
    'md5': '../vendor/md5',
    'underscore': '../vendor/underscore',
    'test': '../test'
  }
};

if (typeof(module) == 'object' && module.exports) {
  // We're running in node.
  module.exports = require;
  // For some reason requirejs in node doesn't like shim function exports.
  require.shim['underscore'].exports = '_';
  require.shim['backbone'].exports = 'Backbone';
} else (function() {
  var RE = /^(https?:)\/\/([^\/]+)\/(.*)\/require-config\.js$/;
  var me = document.querySelector('script[src$="require-config.js"]');
  var console = window.console || {log: function() {}};
  if (me) {
    var parts = me.src.match(RE);
    if (parts) {
      var protocol = parts[1];                                                      
      var host = parts[2];
      var path = '/' + parts[3];
      if (protocol != location.protocol || host != location.host)
        console.log("origins are different. requirejs text plugin may " +
                    "not work.");
      require.baseUrl = path;
    }
  }
  console.log('require.baseUrl is ' + require.baseUrl);
})();
