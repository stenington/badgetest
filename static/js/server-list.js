define(['server', 'backbone', 'localStorage'], function(Server, Backbone, LocalStorage) {

  var ServerList = Backbone.Collection.extend({
    model: Server,
    localStorage: new Backbone.LocalStorage("badgetest-serverlist"),
    initialize: function(models, opts) {
      opts = opts || {};
      this.defaults = opts.defaults || [];
      this.on('add', function(server) { server.save(); });
      this.on('change', function(server) { server.save(); });
      this.on('remove', function(server) { server.destroy(); });
    },
    setDefault: function() {
      this.update(this.defaults);
    }
  });

  return ServerList;

});
