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

    if (spec.unique) {
      var millis = (new Date()).getTime();
      overrides.badge.name = 'Badge ' + millis + '-' + (i+1);
    }
    else {
      overrides.badge.name = 'Non-unique Badge';
    }

    if (spec.generateImages) {
      var hash = md5(overrides.badge.name);
      overrides.badge.image = 
        'http://vanillicon.com/' + hash + '.png';
        //'http://permissiondenied.net/identicon/150/' + hash + '.png';
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
    { name: 'development', url: 'http://dev.openbadges.org/issuer.js' },
    { name: 'staging', url: 'http://stage.openbadges.org/issuer.js' },
    { name: 'production', url: 'http://beta.openbadges.org/issuer.js' }
  ];

  self.count = ko.observable(1);
  self.email = ko.observable();
  var servers = localStorage.servers ? JSON.parse(localStorage.servers) : defaultServers.slice(0);
  self.servers = ko.observableArray(servers);
  self.servers.subscribe(function(servers) {
    localStorage.servers = JSON.stringify(servers);
  });
  self.selectedServer = ko.observable();

  self.generateImages = ko.observable(false);
  self.hash = ko.observable(false);
  self.nonUnique = ko.observable(false);
  self.noModal = ko.observable(false);

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

  self.issue = function() {
    try {
      var assertions = buildAssertions({
        count: self.count(),
        email: self.email(),
        hashed: self.hash(),
        unique: !self.nonUnique(),
        generateImages: self.generateImages()
      });
      log('Assertions', assertions);
      if(self.noModal()){
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
    self.servers.push({ name: self.serverName(), url: self.serverUrl() });
    self.serverName('');
    self.serverUrl('');
  };
  self.serverAddable = ko.computed(function(){
    return self.serverName() && self.serverUrl();
  });
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

