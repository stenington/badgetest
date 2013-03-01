define(['backbone'], function(Backbone) {

  var TogglePanel = Backbone.View.extend({
    events: {
      'click .toggle': 'toggle'
    },
    
    initialize: function(opts) {
      if (opts.startHidden) 
        this.$el.find('.toggled').toggle(false);
    }, 

    toggle: function() {
      this.$el.find('.toggled').slideToggle('fast');
    }
  });

  return TogglePanel;

});
