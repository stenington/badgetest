define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  var IssuerAPI = function(){
    var self = this;

    var script = $('#issuer-api');

    self.availableMethods = [];

    function setMethods() {
      if( OpenBadges.issue ) { 
        self.availableMethods.push({ key: 'modal', name: 'modal Issuer API' }); 
      }
      if( OpenBadges.issue_no_modal ) {
        self.availableMethods.push({ key: 'modaless', name: 'modaless Issuer API' }); 
      }
      if( OpenBadges.connect ) {
        self.availableMethods.push({ key: 'connect', name: 'Backpack Connect' }); 
      }
    }

    var currentXHR;

    self.reloadFrom = function(server) {
      var name = server.get('name');
      self.availableMethods = [];
      self.trigger('reload', name);

      if (currentXHR) currentXHR.abort();
      script.attr('src', server.issuerURL());
      currentXHR = $.getScript(server.issuerURL())
        .success(function(){
          setMethods();
          self.trigger('success', name);
        })
        .fail(function(xhr, textStatus, err){
          if (textStatus === 'abort') 
            self.trigger('abort', name);
          else
            self.trigger('error', name, textStatus, err);
        });
      return currentXHR;
    };
  
    self.unload = function() {
      if (currentXHR) currentXHR.abort();
      currentXHR = null;
      delete window['OpenBadges'];
      self.trigger('unload');
    };

    self.issue = function(method, assertions) {
      switch(method) {
        case 'modal':
          OpenBadges.issue(assertions);
          break;
        case 'modaless':
          OpenBadges.issue_no_modal(assertions);
          break;
        case 'connect': 
          alert('Not yet, bro!');
          // TODO: Backpack Connect
      }
    };

    _.extend(self, Backbone.Events);
  }

  return IssuerAPI;

});
