define(['backbone', 'underscore'], function(Backbone, _) {

  var ServerSelect = Backbone.View.extend({
    events: {
      'change select': 'selectionMade'
    },

    selectionMade: function(evt) { 
      var selected = this.getSelected();
      if (selected)
        this.trigger('select', this.getSelected());
      else 
        this.trigger('deselect');
    },

    loading: function() {
      this.$el.find('select').removeClass('loaded');
    },

    loaded: function() {
      this.$el.find('select').addClass('loaded');
    },

    initialize: function(opts) {
      var opts = opts || {};
      this.listenTo(this.collection, "change", this.render);
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "remove", this.render);
      this.template = _.template($(opts.templateEl).html());
    },

    render: function() {
      var data = { 
        servers: this.collection.toJSON(),
        selected: this.preferServerName
      };
      this.$el.html(this.template(data));
      this.selectionMade();
    },

    getSelected: function() {
      return this.collection.at(this.$el.find('select').val());
    },
    
    select: function(server) {
      var index = this.collection.indexOf(server);
      if (index !== -1) {
        this.$el.find('select').val(index);
        this.selectionMade();
      }
    },

    prefer: function(serverName) {
      this.preferServerName = serverName;
    }
  });
 
  return ServerSelect;

});
