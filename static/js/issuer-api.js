define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  /* Cut and paste buffer
  function forgetToken() {
    window.location.replace(window.location.pathname);
  }

  function refreshToken() {
    var req = new XMLHttpRequest();
    req.open('POST', api_root + '/token');
    req.setRequestHeader('content-type', 'application/json');
    req.onload = function() {
      if (req.status == 200) {
        var info = JSON.parse(req.responseText);
        var url = window.location.pathname +
          '?access_token=' + encodeURIComponent(info.access_token) +
          '&refresh_token=' + encodeURIComponent(info.refresh_token) +
          '&api_root=' + encodeURIComponent(api_root);
        window.location.replace(url);
      }
    };
    req.send(JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }));
  }
  */

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

    self.issue = function(method, assertions, params) {
      try {
        switch(method) {
          case 'modal':
            OpenBadges.issue(assertions);
            break;
          case 'modaless':
            OpenBadges.issue_no_modal(assertions);
            break;
          case 'connect': 
            if (!params.api_root) {
              log("[Backpack Connect] Connecting...");
              var email = params.email;
              var server = params.server;
              OpenBadges.connect({
                callback: window.location.pathname
                  + '?email=' + encodeURIComponent(email)
                  + '&server=' + encodeURIComponent(server),
                scope: ["issue"]
              });
            }
            else {
              log("[Backpack Connect] Issuing...");
              var api_root = params.api_root;
              var access_token = params.access_token;
              var req = new XMLHttpRequest();
              var url = assertions[0];
              $.ajax({
                type: 'POST',
                url: api_root + '/issue',
                data: {
                  badge: url
                },
                headers: {
                  'authorization': 'Bearer ' + btoa(access_token),
                  'content-type': 'application/json'
                },
                success: function(data, textStatus, req) {
                  console.log("status: " + req.status + "\ncontent: " + req.responseText);
                }
              });
            }
        }
      }
      catch (ex) {
        log(ex);
      }
    };

    _.extend(self, Backbone.Events);
  }

  return IssuerAPI;

});
