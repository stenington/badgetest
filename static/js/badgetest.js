function buildAssertions(spec){
  var assertions = [];
  var origin = $(location).attr('protocol') + '//' + $(location).attr('host'); 
  var endpoint = spec.hashed ? 'hashed.json' : 'raw.json';

  for (var i = 0; i < spec.count; i++){
    var assertion = origin 
      + '/' + endpoint 
      + '?email=' + encodeURIComponent(spec.email);

    var overrides = {
      badge: {
        issuer: {
          origin: origin
        }
      }
    };

    if(spec.unique){
      var millis = (new Date()).getTime();
      overrides.badge.name = 'Badge ' + millis + '-' + (i+1);
    }

    assertion += '&override=' + encodeURIComponent(JSON.stringify(overrides));
    assertions[i] = assertion;
  }
  return assertions;
}

$.fn.extend({                                                   
  reloadFrom: function(scriptUrl){
    this.attr('src', scriptUrl);
    return $.getScript(scriptUrl);                              
  },  
});   

var ViewModel = function() {
  var self = this;

  var defaultServers = [
    { name: 'development', url: 'http://dev.openbadges.org/issuer.js',
      backpackConnect: null },
    { name: 'staging', url: 'http://stage.openbadges.org/issuer.js',
      backpackConnect: null },
    { name: 'production', url: 'http://beta.openbadges.org/issuer.js',
      backpackConnect: null }
  ];

  self.count = ko.observable(1);
  self.email = ko.observable();
  var servers = localStorage.servers ? JSON.parse(localStorage.servers) : defaultServers.slice(0);
  servers.forEach(function(server) {
    if (!server.backpackConnect) server.backpackConnect = null;
  });
  self.servers = ko.observableArray(servers);
  self.servers.subscribe(function(servers) {
    localStorage.servers = JSON.stringify(servers);
  });
  self.selectedServer = ko.observable();

  self.hash = ko.observable(false);
  self.nonUnique = ko.observable(false);
  self.noModal = ko.observable(false);
  self.backpackConnect = ko.observable(true);

  self.reloadAPI = function(viewModel, evt) {
    self.apiLoaded(false);
    var server = viewModel.selectedServer();
    if (server) {
      log("Reloading Issuer API from", server.name, "<" + server.url + ">");
      $('#issuer-api').reloadFrom(server.url)
        .success(function() {
          log("Issuer API loaded from", server.name);
          self.apiLoaded(true); 
        })
        .fail(function() {
          log("FAAAAAIL"); 
        });
    }
  };
  self.apiLoaded = ko.observable(false);

  self._issueViaBackpackConnect = function(assertions) {
    var server = self.selectedServer();
    var issue = function() {
      $.ajax({
        type: 'POST',
        url: '/issue',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({backpackConnect: server.backpackConnect,
                              assertions: assertions}),
        success: function(data) {
          alert(JSON.stringify(data, null, 2));
        },
        error: function(xhr) {
          alert("Alas, an error occurred: " + xhr.status + " " +
                xhr.responseText);
        }
      });
      console.log("YAY ISSUE", server.backpackConnect);
    };

    if (!OpenBadges.connect)
      return alert("The selected server doesn't support Backpack Connect.");
    if (assertions.length > 1)
      return alert("Only one badge can be sent at a time.");
    if (server.backpackConnect)
      issue();
    else {
      localStorage.polledBackpackConnectResult = "";
      var bpcWindow = window.open("/backpack-connect.html?" + $.param({
        issuer_js_url: server.url
      }));
      var interval = setInterval(function() {
        if (localStorage.polledBackpackConnectResult) {
          clearInterval(interval);
          var bpcInfo = JSON.parse(localStorage.polledBackpackConnectResult);
          server.backpackConnect = bpcInfo;
          alert("Backpack connect successful! You need to reload the page for its contents to be changed now because knockoutjs is CONFUSING AS HELL.");          
          self.servers.valueHasMutated();
          issue();
        }
      }, 100);
    }
  };
  self.issue = function() {
    try {
      var assertions = buildAssertions({
        count: self.count(),
        email: self.email(),
        hashed: self.hash(),
        unique: !self.nonUnique()
      });
      log('Assertions', assertions);
      if(self.backpackConnect()){
        self._issueViaBackpackConnect(assertions);
      }
      else if(self.noModal()){
        OpenBadges.issue_no_modal(assertions);
      }
      else {
        OpenBadges.issue(assertions);
      }
    }
    catch (ex) {
      log(ex);
    }
    return false;
  };

  self.serverName = ko.observable();
  self.serverUrl = ko.observable();
  self.addServer = function() {
    self.servers.push({ name: self.serverName(), url: self.serverUrl(),
                        backpackConnect: null });
    self.serverName('');
    self.serverUrl('');
  };
  self.serverAddable = ko.computed(function(){
    return self.serverName() && self.serverUrl();
  });
  self.refreshServerTokens = function(server) {
    $.ajax({
      type: 'POST',
      url: '/refresh',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(server.backpackConnect),
      success: function(data) {
        if (data.statusCode == 200) {
          server.backpackConnect.access_token = data.body.access_token;
          server.backpackConnect.refresh_token = data.body.refresh_token;
          self.servers.valueHasMutated();
          alert("Success! You need to reload the page for its contents to be changed now because knockoutjs is CONFUSING AS HELL.");
        } else
          alert(JSON.stringify(data, null, 2));
      },
      error: function(xhr) {
        alert("Alas, an error occurred: " + xhr.status + " " +
              xhr.responseText);
      }
    });
  };
  self.removeServer = function(server) {
    var i = self.servers.indexOf(server);
    self.servers.splice(i, 1);
  };
  self.resetServers = function() {
    self.servers(defaultServers.slice(0));
  };

  self.showAdvanced = ko.observable(false);
  self.toggleAdvanced = function() {
    self.showAdvanced(!self.showAdvanced());
  };
  self.advancedToggleText = ko.computed(function() {
    return self.showAdvanced() ? "Hide advanced options" : "Show advanced options";
  });
};

var vm = new ViewModel();
ko.applyBindings(vm);

