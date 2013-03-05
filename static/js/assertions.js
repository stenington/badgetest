define(['jquery', 'md5'], function($, md5) {

  return function buildAssertions(spec){
    var spec = spec || {};
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
      else {
        overrides.badge.name = 'Non-unique Badge';
      }

      if (spec.generateImages) {
        var hash = md5(overrides.badge.name);
        overrides.badge.image = 
          'http://vanillicon.com/' + hash + '.png';
          //'http://permissiondenied.net/identicon/220/' + hash + '.png';
      }

      assertion += '&override=' + encodeURIComponent(JSON.stringify(overrides));
      assertions[i] = assertion;
    }
    return assertions;
  }

});
