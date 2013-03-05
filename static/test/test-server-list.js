defineTests(['server-list'], function(ServerList) {
  module('ServerList');

  test('defaults default to []', function(){
    var sl = new ServerList([ { name: 'a' }, { name: 'b' } ]);
    deepEqual(sl.toJSON(), [{ name: 'a' }, { name: 'b' }]);
    deepEqual(sl.setDefault().toJSON(), []);
  });

  test('setDefault() sets defaults', function(){
    var sl = new ServerList([ { name: 'a' }, { name: 'b' } ], {
      defaults: [ { name: 'default' } ] 
    });
    deepEqual(sl.pluck('name'), ['a', 'b']);
    // .toJSON() here has added an id to the default model
    // because backbone is awful, so let's pluck
    deepEqual(sl.setDefault().pluck('name'), ['default']);
  });
});
