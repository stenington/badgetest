define(['backbone', 'underscore'], function(Backbone, _) {

  var ServerSelect = Backbone.View.extend({
    events: {
      'change .server-select': 'reload'
    },

    reload: function(evt) { 
      this.$el.find('.server-select').removeClass('loaded');
      var index = $(evt.target).val();
      this.issuerAPI.reloadFrom(this.collection.at(index));

    },

    initialize: function(opts) {
      this.issuerAPI = opts.issuerAPI;
      var that = this; 
      this.issuerAPI.on('success', function(){
        that.$el.find('.server-select').addClass('loaded');
      });

      this.listenTo(this.collection, "change", this.render);
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "remove", this.render);
      this.template = _.template($('#server-select-template').html());
    },

    render: function() {
      this.$el.html(this.template({ servers: this.collection.toJSON() }));
    }
  });
 
  return ServerSelect;

});
