defineTests([
  'views/server-select', 
  'server-list'
], function(ServerSelect, ServerList) {

  var list, view;

  module('ServerSelect', {
    setup: function() {
      $('<script type="text/html"></script>')
        .appendTo('#qunit-fixture')
        .html(
          '<select>' +
            '<% _.each(servers, function(server, index) { %>' + 
            '<option value="<%= index %>"><%= server.name %></option>' + 
            '<% }); %>' +
          '</select>'
        );
      list = new ServerList([
        { name: 'a', url: 'url-a' },
        { name: 'b', url: 'url-b' }
      ]);
      view = new ServerSelect({
        collection: list,
        templateEl: $('#qunit-fixture script')
      });
      view.render();
    },
    teardown: function() {
      $('#qunit-fixture').empty();
    }
  });

  test("'select' triggers when a selection is made", function() {
    expect(1);
    view.on('select', function(server) {
      ok(1);
    });
    view.$el.find('select').change();
  });

  test("'select' has selected server", function() {
    expect(1); 
    view.on('select', function(server) {
      deepEqual(server.toJSON(), { name: 'b', url: 'url-b' });
    });
    view.$el.find('select').val(1);
    view.$el.find('select').change();
  });

  test("'deselect' triggers when nothing selected", function() {
    expect(1);
    view.on('deselect', function() {
      ok(1);
    });
    list.remove(list.at(1));
    list.remove(list.at(0)); /* no options left */
  });

  test("getSelected returns selected server", function() {
    equal(view.getSelected().get('name'), 'a');
    view.$el.find('select').val(1);
    equal(view.getSelected().get('name'), 'b');
  });

  test("getSelected returns undefined if nothing selected", function() {
    list.remove(list.at(1));
    list.remove(list.at(0)); /* no options left */
    equal(view.getSelected(), undefined);
  });
});
