(function($){

  if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function(msg) {
      alert(msg);
    };
  }

  function buildAssertions(spec){
    var assertions = [];
    var origin = $(location).attr('protocol') + '//' + $(location).attr('host'); 
    var endpoint = spec.hashed ? 'hashed.json' : 'raw.json';

    for (var i = 0; i < spec.count; i++){
      var assertion = origin 
        + '/' + endpoint 
        + '?email=' + encodeURIComponent(spec.email);

      var overrides = {
        badge: {
          issuer: {
            origin: origin
          }
        }
      };

      if(spec.unique){
        var millis = (new Date()).getTime();
        overrides.badge.name = 'Badge ' + millis + '-' + (i+1);
      }

      assertion += '&override=' + encodeURIComponent(JSON.stringify(overrides));
      assertions[i] = assertion;
    }
    return assertions;
  }

  $.fn.extend({                                                   
    reloadFrom: function(scriptUrl){
      this.attr('src', scriptUrl);
      return $.getScript(scriptUrl);                              
    },  
  });   

  $(document).ready(function(){
    $('#go').click(function(){
      try {
        var assertions = buildAssertions({
          count: $('#count').val(),
          email: $('#email').val(),
          hashed: $('#hash').is(':checked'),
          unique: !$('#non-unique').is(':checked')
        });
        console.log('Assertions', assertions);
        if($('#no-modal').is(':checked')){
          OpenBadges.issue_no_modal(assertions);
        }
        else {
          OpenBadges.issue(assertions);
        }
      }
      catch (ex) {
        console.log(ex);
      }
      return false;
    });

    $('#server').change(function(){
      var subdomain = $(this).val();
      $('#go').attr('disabled', true);
      $('#issuer-api').reloadFrom('http://' + subdomain + '.openbadges.org/issuer.js')
      .success(function(){
        $('#go').attr('disabled', false);
      })
      .fail(function(){
        console.log('getScript failed on' + subdomain);
      });
    });
    $('#server').change();
  });

})(jQuery);
