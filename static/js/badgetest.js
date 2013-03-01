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

function Server(options) {
  this.name = ko.observable(options.name);
  this.url = ko.observable(options.url);
  this.access_token = ko.observable(options.access_token);
  this.refresh_token = ko.observable(options.refresh_token);
  this.api_root = ko.observable(options.api_root);
}

$.fn.extend({                                                   
  reloadFrom: function(scriptUrl){
    this.attr('src', scriptUrl);
    return $.getScript(scriptUrl);                              
  },  
});   

// Exactly why knockout doesn't provide something that does this, or
// is at least capable of observing an array of models, is completely
// beyond me. -AV
function syncChangesToLocalStorage(servers, keyName) {
  var watching = [];

  function save() {
    if (window.console) console.log("SAVE MODEL");
    localStorage[keyName] = ko.toJSON(servers);
  }
  
  function observeModel(model) {
    Object.keys(model).forEach(function(key) {
      if (model[key] &&
          typeof(model[key]) == 'function' &&
          typeof(model[key].subscribe) == 'function') {
        model[key].subscribe(save);
      }
    });
  }

  function onServersChange() {
    servers().forEach(function(server) {
      if (watching.indexOf(server) == -1) {
        if (window.console) console.log("NOW WATCHING", server.name());
        watching.push(server);
        observeModel(server);
      }
    });
    // TODO: Stop watching any servers that have been removed from the
    // observable array.
    save();
  }
  
  servers.subscribe(onServersChange);
  onServersChange();
}

var ViewModel = function() {
  var self = this;

  var defaultServers = [
    { name: 'development', url: 'http://dev.openbadges.org/issuer.js' },
    { name: 'staging', url: 'http://stage.openbadges.org/issuer.js' },
    { name: 'production', url: 'http://beta.openbadges.org/issuer.js' }
  ];
  var resetServers = function() {
    localStorage.servers = JSON.stringify(defaultServers);
  };
  var loadServers = function() {
    var servers = JSON.parse(localStorage.servers);
    self.servers.splice(0, self.servers().length);
    servers.forEach(function(options) {
      self.servers.push(new Server(options));
    });
  };
  self.count = ko.observable(1);
  self.email = ko.observable();
  self.servers = ko.observableArray([]);
  
  if (!localStorage.servers) resetServers();
  
  loadServers();
  syncChangesToLocalStorage(self.servers, 'servers');
  self.selectedServer = ko.observable();

  self.hash = ko.observable(false);
  self.nonUnique = ko.observable(false);
  self.noModal = ko.observable(false);
  self.backpackConnect = ko.observable(true);

  self.reloadAPI = function(viewModel, evt) {
    self.apiLoaded(false);
    var server = viewModel.selectedServer();
    if (server) {
      log("Reloading Issuer API from", server.name(), "<" + server.url() + ">");
      $('#issuer-api').reloadFrom(server.url())
        .success(function() {
          log("Issuer API loaded from", server.name());
          self.apiLoaded(true); 
        })
        .fail(function() {
          log("FAAAAAIL"); 
        });
    }
  };
  self.apiLoaded = ko.observable(false);

  self._issueViaBackpackConnect = function(assertion) {
    var server = self.selectedServer();
    var issue = function() {
      $.ajax({
        type: 'POST',
        url: '/issue',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({access_token: server.access_token(),
                              api_root: server.api_root(),
                              assertion: assertion}),
        success: function(data) {
          alert(JSON.stringify(data, null, 2));
        },
        error: function(xhr) {
          alert("Alas, an error occurred: " + xhr.status + " " +
                xhr.responseText);
        }
      });
    };

    if (!OpenBadges.connect)
      return alert("The selected server doesn't support Backpack Connect.");
    if (server.access_token())
      issue();
    else {
      localStorage.polledBackpackConnectResult = "";
      var bpcWindow = window.open("/backpack-connect.html?" + $.param({
        issuer_js_url: server.url()
      }));
      var interval = setInterval(function() {
        if (localStorage.polledBackpackConnectResult) {
          clearInterval(interval);
          var bpcInfo = JSON.parse(localStorage.polledBackpackConnectResult);
          server.access_token(bpcInfo.access_token);
          server.refresh_token(bpcInfo.refresh_token);
          server.api_root(bpcInfo.api_root);
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
        if (assertions.length > 1)
          return alert("Only one badge can be sent at a time.");
        self._issueViaBackpackConnect(assertions[0]);
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
    self.servers.push(new Server({
      name: self.serverName(),
      url: self.serverUrl()
    }));
    self.serverName('');
    self.serverUrl('');
  };
  self.serverAddable = ko.computed(function(){
    return self.serverName() && self.serverUrl();
  });
  self.forgetServerTokens = function(server) {
    server.access_token(null);
    server.refresh_token(null);
  };
  self.refreshServerTokens = function(server) {
    $.ajax({
      type: 'POST',
      url: '/refresh',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        refresh_token: server.refresh_token(),
        api_root: server.api_root()
      }),
      success: function(data) {
        if (data.statusCode == 200) {
          server.access_token(data.body.access_token);
          server.refresh_token(data.body.refresh_token);
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
    resetServers();
    loadServers();
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

