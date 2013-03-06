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
      this.$el.html(this.template({ servers: this.collection.toJSON() }));
      this.selectionMade();
    },

    getSelected: function() {
      return this.collection.at(this.$el.find('select').val());
    }
  });
 
  return ServerSelect;

});
