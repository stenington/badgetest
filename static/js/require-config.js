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
    }
  },
  paths: {
    'backbone': '../vendor/backbone',
    'localStorage': '../vendor/backbone.localStorage',
    'jquery': '../vendor/jquery-1.9.1',
    'underscore': '../vendor/underscore'
  }
};