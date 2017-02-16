var fs = require('fs');

module.exports.getSketches = getSketches;
module.exports.getAttributes = getAttributes;

function getFilesInFolder (folder, callback) {
  fs.readdir(folder, callback);
}

function getFilesOfType (files, type) {
  var types = [];
  var regex = new Regex('\.' + type + '$');
  files.forEach(function (file) {
    if(regex.test(file)) types.push(file);
  });
  return types;
}

function getFolders (files) {
  var folders = [];
  var regex = /\./;
  files.forEach(function (file) {
    if (!regex.test(file)) folders.push(file);
  });
  return folders;
}

function getSketches (callback) {
  getFilesInFolder('./sketches', function (err, files) {
    if (err) return callback(err);

    var sketchfolders = getFolders(files);

    async_attributes_processor(0, [], function (err, sketches) {
      callback(null, sketches);
    });

    // sketchfolders.forEach(function (sketchfolder) {
      // getFilesInFolder('../sketches/' + sketchfolder, function (err, sketchfiles) {
      //   if (err) return callback(err);
      //
      //   if (sketchfiles.indexOf('.attr') > -1) {
      //     fs.readFile('../sketches/' + sketchfolder + '/.attr', 'utf8', function (err, file) {
      //       var attributes = processAttributes(file);
      //       attributes.src = '/sketches/' + sketchfolder;
      //       sketches.push(attributes)
      //     });
      //   } else {
      //     sketches.push({ src: '/sketches/' + sketchfolder });
      //   }
      // });
    // });

    function async_attributes_processor (i, sketches, callback2) {
      var sketchfolder = sketchfolders[i];

      getAttributes(sketchfolder, function (err, attributes) {
        if (err) return callback2(err);

        sketches.push(attributes);
        if (i < sketchfolders.length - 1) {
          async_attributes_processor(i + 1, sketches, callback2);
        } else {
          callback2(null, sketches);
        }
      });

      // getFilesInFolder('./sketches/' + sketchfolder, function (err, sketchfiles) {
      //   if (err) return callback(err);
      //
      //   if (sketchfiles.indexOf('.attr') > -1) {
      //     fs.readFile('./sketches/' + sketchfolder + '/.attr', 'utf8', function (err, file) {
      //       var attributes = processAttributes(file);
      //       attributes.src = '/sketches/' + sketchfolder;
      //       sketches.push(attributes)
      //       if (i < sketchfolders.length - 1) {
      //         async_attributes_processor(i++, sketches, callback2);
      //       } else {
      //         callback2(sketches);
      //       }
      //     });
      //   } else {
      //     sketches.push({ src: '/sketches/' + sketchfolder });
      //     if (i < sketchfolders.length - 1) {
      //       async_attributes_processor(i++, sketches, callback2);
      //     } else {
      //       callback2(sketches);
      //     }
      //   }
      // });
    }
  });
}

function getAttributes(sketch, callback) {
  getFilesInFolder('./sketches/' + sketch, function (err, sketchfiles) {
      if (err) return callback(err);

      if (sketchfiles.indexOf('.attr') > -1) {
        fs.readFile('./sketches/' + sketch + '/.attr', 'utf8', function (err, file) {
          var attributes = processAttributes(file);
          attributes.src = '/' + sketch;
          return callback(null, attributes);
        });
      } else {
        var attributes = { name: sketch, src: '/' + sketch };
        return callback(null, attributes);
      }
    });
}

function processAttributes(file) {
  var generator, fn, fnstring, attr;

  generator = file.replace(/-([\w_]+) +([\w _.@]+)/g, function (str, key, value) {
    // This is a tag
    if (key) {
      value = value.replace(/ $/g, '');
      return key + ': \'' + value + '\',';
    }
  });

  fnstring = 'return {' + generator + '};';
  fn = new Function(fnstring)
  return fn();
}
