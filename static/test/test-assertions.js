"use strict";

defineTests(['assertions'], function(buildAssertions) {
  module('Assertions');

  test('count determines number of assertions', function() {
    equal(buildAssertions({count: 1}).length, 1);
    equal(buildAssertions({count: 5}).length, 5);
  });

  test('hashed uses hashed endpoint', function() {
    ok(buildAssertions({count: 1})[0].match(/raw.json/));
    ok(buildAssertions({count: 1, hashed: true})[0].match(/hashed.json/));
  });

  test('assertion host assumed to be page host', function(){
    ok(buildAssertions({count: 1})[0].indexOf(window.location.origin) === 0);
  });

  test('email used as email', function() {
    var assertion = buildAssertions({count: 1, email: 'foo@bar.org'})[0];
    ok(assertion.match(encodeURIComponent('foo@bar.org')));
  });

  test('unique forces unique assertions', function() {
    var assertions = buildAssertions({count: 2, email: 'foo@bar.org'});
    equal(assertions[0], assertions[1]);
    assertions = buildAssertions({count: 2, email: 'foo@bar.org', unique: true});
    notEqual(assertions[0], assertions[1]);
  });

  test('generateImages uses vanillicons for badge image', function() {
    var assertion = buildAssertions({count: 1, generateImages: true})[0];
    ok(assertion.match('vanillicon.com'));
  });
});
