define(['backbone', 'underscore'], function(Backbone, _) {
  
  var IssueSelect = Backbone.View.extend({
    initialize: function(opts) {
      this.issuerAPI = opts.issuerAPI;
      this.issuerAPI.on('reload', function(){ this.render(); }, this);
      this.issuerAPI.on('success', function(){ this.render(); }, this);
      this.template = _.template($('#issue-methods-template').html());
    },

    render: function() {
      this.$el.html(this.template({ methods: this.issuerAPI.availableMethods }));
    }
  });

  return IssueSelect;

});
