define(['backbone', 'underscore'], function(Backbone, _) {

  var ServerControls = Backbone.View.extend({
    events: {
      'click .remove': 'remove',
      'click .add': 'add',
      'click .reset': 'reset'
    },

    initialize: function(opts) {
      this.listenTo(this.collection, "change", this.render);
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "remove", this.render);
      this.template = _.template($('#server-list-template').html());
    },

    render: function() {
      var tbody = this.$el.find('.server-config tbody');
      tbody.find('tr:not(.add-control)').remove();
      tbody.prepend(this.template({ servers: this.collection.toJSON() }));
    },

    remove: function(evt) {
      var index = $(evt.target).attr('data-index');
      this.collection.remove(this.collection.at(index));
    },

    add: function(evt) {
      this.collection.add({
        name: this.$el.find('.add-control .name').val(),
        url: this.$el.find('.add-control .url').val()
      });
    },

    reset: function(evt) {
      this.collection.setDefault();
    }
  });

  return ServerControls;

});
