define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var IssuerAPI = function(){
    var self = this;

    var script = $('#issuer-api');

    self.reloadFrom = function(server) {
      self.trigger('reload', server.get('name'));
      script.attr('src', server.get('url'));
      return $.getScript(server.get('url'))
        .success(function(){
          self.trigger('success');
        })
        .fail(function(){
          self.trigger('error');
        });
    };

    _.extend(self, Backbone.Events);
  }

  return IssuerAPI;

});
