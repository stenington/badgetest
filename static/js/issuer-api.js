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

    self.reloadFrom = function(server) {
      self.availableMethods = [];
      self.trigger('reload', server.get('name'));

      script.attr('src', server.issuerURL());
      return $.getScript(server.issuerURL())
        .success(function(){
          setMethods();
          self.trigger('success');
        })
        .fail(function(){
          self.trigger('error');
        });
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
