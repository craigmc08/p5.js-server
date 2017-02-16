var fs = require('fs');

// Get a value from an object with keys in dot notation (get(obj, 'five.four.three') = obj.five.four.three)
var get = function (obj, key) {
  var i, accessor = key.split('.');
  for (i = 0; i < accessor.length; i++) {
    if (!obj) return ''; // Return an empty string if it doesn't exist
    obj = obj[accessor[i]];
  }
  return obj;
}

var cache = {};
var render = function (template, context) {
  if (!cache[template]) {
    cache[template] = compile(template);
  }
  return cache[template](context);
}

var compile = function (template) {
  var stack = [], fn, safeIterVar, block, fnstring;

  // replace tags
  template = template.replace(/(\\*){(?:([\w_.\-@]+)|for +([\w_\-@]+) +in +([\w_.\-@]+)|if +([\w_.\-@]+)|\/(for|if))}+/g, function (str, escapeChar, key, iterVar, forKey, ifKey, closeStatement) {
    if (escapeChar) return str.replace('\\\\', '');

    if (key) {
      // key = 'obj.key': returns '+ g(c, 'obj.key') +'
      return '\'+ g(c,\'' + key + '\') +\'';
    }

    if (forKey) {
      safeIterVar = iterVar.replace('-', '__');
      stack.push({statement: 'for', forKey: forKey, iterVar: iterVar, safeIterVar: safeIterVar});
      return '\';var __' + safeIterVar + '=g(c,\'' + iterVar + '\');var ' + safeIterVar + 'A=g(c,\'' + forKey + '\');for(var ' + safeIterVar + 'I=0;' + safeIterVar + 'I<' + safeIterVar + 'A.length;' + safeIterVar + 'I++){c[\'' + iterVar + '\']=' + safeIterVar + 'A[' + safeIterVar + 'I];b+=\'';
    }

    if (ifKey) {
      stack.push({statement: 'if', ifKey: ifKey});
      return '\';if(g(c,\'' + ifKey + '\')){b+=\'';
    }

    if (closeStatement) {
      block = stack[stack.length - 1];
      if (block && block.statement == closeStatement) {
        stack.pop();
        return '\'}' + (block.statement == 'for' ? 'c[\'' + block.iterVar + '\']=__' + block.safeIterVar + ';' : '') + 'b+=\'';
      }
      console.warn('extra {/' + closeStatement + '} ignored');
      return '';
    }

    return str;
  });

  // remove newlines/linebreaks
  template = template.replace(/\r?\n|\r/g, '');

  fnstring = 'return function(c){var b=\'' + template + '\';return b;}';
  fn = new Function('g', fnstring);
  return fn(get);
}

module.exports = function (filePath, options, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err);

    callback(null, render(content.toString(), options));
  });
};
