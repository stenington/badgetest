define(['backbone'], function(Backbone) {

  var ChoiceWatcher = Backbone.View.extend({
    events: {
      'change select': 'recordSelect',
      'click input[type=checkbox]': 'recordCheckbox',
      'change input[type=text]': 'recordText'
    },

    recordSelect: function(evt) {
      var el = $(evt.target);
      this.collection.add({
        type: 'select',
        id: el.attr('id'),
        value: el.val()
      }, { merge: true });
    },

    recordCheckbox: function(evt) {
      var el = $(evt.target);
      this.collection.add({
        type: 'checkbox',
        id: el.attr('id'),
        value: el.prop('checked')
      }, { merge: true });
    },

    recordText: function(evt) {
      var el = $(evt.target);
      this.collection.add({
        type: 'text',
        id: el.attr('id'),
        value: el.val()
      }, { merge: true });
    },

    setChoices: function(criteria) {
      var elements = this.collection;
      if (criteria)
        elements = new Backbone.Collection(elements.where(criteria));
      elements.each(function(el) {
        var el = el.toJSON();
        var id = '#' + el.id;
        console.log('processing', el);
        switch (el.type) {
          case 'checkbox':
            $(id).prop('checked', el.value);
            break;
          case 'select':
          case 'text':
            $(id).val(el.value);
            $(id).change();
            break;
        }
      });
    }
  });

  return ChoiceWatcher;

});
