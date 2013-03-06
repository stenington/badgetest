define(['backbone', 'underscore'], function(Backbone, _) {
  
  var IssueSelect = Backbone.View.extend({
    initialize: function(opts) {
      this.model.on('reload', function(){ this.render(); }, this);
      this.model.on('success', function(){ this.render(); }, this);
      this.template = _.template($('#issue-methods-template').html());
    },

    render: function() {
      this.$el.html(this.template({ methods: this.model.availableMethods }));
    }
  });

  return IssueSelect;

});
