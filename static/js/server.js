define(['backbone'], function(Backbone) {

  var Server = Backbone.Model.extend({
    issuerURL: function() {
      var url = this.get('url');
      if (url.indexOf('issuer.js') === -1) {
        if (url.charAt(url.length-1) !== '/') url += '/';
        url += 'issuer.js';
      }
      return url;
    }
  });
  return Server;

});
