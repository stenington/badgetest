// Should maybe just use Underscore.js, but...

function clone(source) {
  var obj = {};
  for (var prop in source) {
    obj[prop] = source[prop];
  }
  return obj;
}

function override(base, overrides) {
  var obj = clone(base);
  for (var prop in overrides) {
    if (obj[prop] == null) obj[prop] = overrides[prop];
    else if (typeof obj[prop] === 'object') obj[prop] = override(obj[prop], overrides[prop]);
    else obj[prop] = overrides[prop];
  }
  return obj;
}

function defaults(base, values) {
  var obj = clone(base);
  for (var prop in values) {
    if (obj[prop] == null) obj[prop] = values[prop]; 
    else if(typeof obj[prop] === 'object') obj[prop] = defaults(obj[prop], values[prop]);
  }
  return obj;
}

exports.clone = clone;
exports.override = override;
exports.defaults = defaults;
