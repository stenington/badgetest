var vows = require('vows');
var assert = require('assert');
var helpers = require('../helpers');

vows.describe('Helpers').addBatch({
  'An object': {
    topic: { 
      a: 'foo', 
      b: 'bar', 
      c: { 
        innerA: 'blah', 
        innerB: 'bleh' 
      },
      d: ''
    },
    'when cloned': {
      topic: function(topic){
        return { obj: topic, clone: helpers.clone(topic) };
      },
      'should copy values': function (topic) {
        assert.deepEqual(topic.obj, topic.clone);
      },
      'should return new object': function (topic) {
        assert.notStrictEqual(topic.obj, topic.clone);
      }
    },
    'when overriden': {
      'with top-level values': {
        topic: function(topic){
          var overrides = { a: 'new', x: 'new' };
          return { 
            obj: topic, 
            overrides: overrides, 
            result: helpers.override(topic, overrides) 
          };
        },
        'should change existing attribute': function (topic) {
          assert.equal(topic.result.a, topic.overrides.a);
        },
        'should set non-existing attribute': function (topic) {
          assert.equal(topic.result.x, topic.overrides.x);
        },
        'should not change unspecified attribute': function (topic) {
          assert.equal(topic.result.b, topic.obj.b);
        }
      },
      'with nested values': {
        topic: function(topic){
          var overrides = { c: { innerA: 'new', x: 'new' } };
          return { 
            obj: topic, 
            overrides: overrides, 
            result: helpers.override(topic, overrides) 
          };
        },
        'should change exisiting attribute': function (topic) {
          assert.equal(topic.result.c.innerA, topic.overrides.c.innerA);
        },
        'should set non-exisiting attribute': function (topic) {
          assert.equal(topic.result.c.x, topic.overrides.c.x);
        },
        'should not change unspecified attribute': function (topic) {
          assert.equal(topic.result.c.innerB, topic.obj.c.innerB);
        }
      },
    },
    'when defaulted': {
      'with top-level values': {
        topic: function(topic){
          var defaults = { a: 'new', x: 'new' };
          return { 
            obj: topic, 
            defaults: defaults, 
            result: helpers.defaults(topic, defaults) 
          };
        },
        'should not change existing attribute': function (topic) {
          assert.equal(topic.result.a, topic.obj.a);
        },
        'should set non-existing attribute': function (topic) {
          assert.equal(topic.result.x, topic.defaults.x);
        },
        'should not change unspecified attribute': function (topic) {
          assert.equal(topic.result.b, topic.obj.b);
        },
        'should not change empty string attributes': function (topic) {
          assert.equal(topic.result.d, '');
        }
      },
      'with nested values': {
        topic: function(topic){
          var defaults = { c: { innerA: 'new', x: 'new' } };
          return { 
            obj: topic, 
            defaults: defaults, 
            result: helpers.defaults(topic, defaults) 
          };
        },
        'should not change exisiting attribute': function (topic) {
          assert.equal(topic.result.c.innerA, topic.obj.c.innerA);
        },
        'should set non-exisiting attribute': function (topic) {
          assert.equal(topic.result.c.x, topic.defaults.c.x);
        },
        'should not change unspecified attribute': function (topic) {
          assert.equal(topic.result.c.innerB, topic.obj.c.innerB);
        }
      }
    }
  }
}).export(module);
