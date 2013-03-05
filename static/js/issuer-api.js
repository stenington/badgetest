define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function issue(url) {
    var req = new XMLHttpRequest();
    req.open('POST', api_root + '/issue');
    req.setRequestHeader('authorization', 'Bearer ' + btoa(access_token));
    req.setRequestHeader('content-type', 'application/json');
    req.onload = function() {
      console.log("status: " + req.status + "\ncontent: " + req.responseText);
    };
    req.send(JSON.stringify({badge: url}));
  }

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

  function connect() {
    OpenBadges.connect({
      callback: window.location.pathname,
      scope: ["issue"]
    });
  }

  var access_token = getParameterByName('access_token');
  var refresh_token = getParameterByName('refresh_token');
  var api_root = getParameterByName('api_root');

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
      self.availableMethods = [];
      self.trigger('reload', server.get('name'));

      if (currentXHR) currentXHR.abort();
      script.attr('src', server.issuerURL());
      return $.getScript(server.issuerURL())
        .success(function(){
          setMethods();
          self.trigger('success');
          self.trigger('done');
        })
        .fail(function(){
          self.trigger('error');
          self.trigger('done');
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
          if (!api_root)
            connect();
          else
            assertions.forEach(function(assertion){
              issue(assertion);
            });
      }
    };

    _.extend(self, Backbone.Events);
  }

  return IssuerAPI;

});
