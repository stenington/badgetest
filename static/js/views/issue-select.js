define(['backbone', 'underscore'], function(Backbone, _) {
  
  var IssueSelect = Backbone.View.extend({
    initialize: function(opts) {
      this.model.on('reload', function(){ this.render(); }, this);
      this.model.on('success', function(){ this.render(); }, this);
      this.template = _.template($('#issue-methods-template').html());
    },

    render: function() {
      var data = { 
        methods: this.model.availableMethods,
        selected: this.preferMethod
      };
      this.$el.html(this.template(data));
    },

    getSelected: function() {
      return this.$el.find('select').val();
    },

    prefer: function(method) {
      this.preferMethod = method;
    }
  });

  return IssueSelect;

});
