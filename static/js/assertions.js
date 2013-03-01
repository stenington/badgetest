define(['jquery'], function($) {

  return function buildAssertions(spec){
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

});
