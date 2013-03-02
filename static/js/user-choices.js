define([
  'backbone',
  'localStorage',
  'user-choice'
], function(Backbone, LocalStorage, UserChoice) {

  var UserChoices = Backbone.Collection.extend({
    model: UserChoice,
    localStorage: new Backbone.LocalStorage("badgetest-userchoices"),
    initialize: function() {
      this.on('change', function(model){ model.save(); });
      this.on('add', function(model){ model.save(); });
      this.on('remove', function(model){ model.save(); });
    }
  });

  return UserChoices;
});
