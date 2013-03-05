define(['backbone', 'assertions', 'config'], function(Backbone, buildAssertions, config) {

  function getOptions() {
    var generateImages = false;
    if ($('#generatePNG').is(':checked')) {
      generateImages = parseInt($('#image-size').val(), 10) || config.defaultBadgeImageSize;
      console.log(generateImages);
    }

    return {
      count: $('#badge-count').val(),
      email: $('#email').val(),
      hashed: $('#hashed').is(':checked'),
      unique: !$('#non-unique').is(':checked'),
      generateImages: generateImages
    };
  }

  var GoControl = Backbone.View.extend({
    events: {
      'click .go': 'go'
    },

    go: function() {
      try {
        var assertions = buildAssertions(getOptions());
        log('Assertions:', assertions);
        this.issuerAPI.issue($('.issue-method select').val(), assertions);
      }
      catch (ex) {
        log(ex);
      }
      return false;
    },

    initialize: function(opts) {
      this.issuerAPI = opts.issuerAPI;
      this.$el.find('.loaded').hide();
      var that = this;
      this.issuerAPI.on('reload', function(from){ that.loading(from); });
      this.issuerAPI.on('success', function(){ that.loaded(); });
    },

    loading: function(from) {
      this.$el.find('.where').html(from);
      this.$el.find('.loading').toggle(true);
      this.$el.find('.loaded').toggle(false);
    },

    loaded: function() {
      this.$el.find('.loading').toggle(false);
      this.$el.find('.loaded').toggle(true);
    }

  });
  
  return GoControl;

});
