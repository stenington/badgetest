define(['server', 'backbone', 'localStorage'], function(Server, Backbone, LocalStorage) {

  var ServerList = Backbone.Collection.extend({
    model: Server,
    localStorage: new Backbone.LocalStorage("badgetest-serverlist"),
    initialize: function() {
      this.on('add', function(server) { server.save(); });
      this.on('change', function(server) { server.save(); });
      this.on('remove', function(server) { server.destroy(); });
    },
    setDefault: function() {
      this.update([
        { name: 'development', url: 'http://dev.openbadges.org/issuer.js' },
        { name: 'staging', url: 'http://stage.openbadges.org/issuer.js' },
        { name: 'production', url: 'http://beta.openbadges.org/issuer.js' }
      ]);
    }
  });

  return ServerList;

});
