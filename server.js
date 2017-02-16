/*
 * author: craigmc08
*/

var express = require('express');
var app = express();
var fs = require('fs');

// Templating Engine
var engine = require('./lib/engine');

var cg = require('./lib/contextgenerator');

app.engine('tmpl', engine);
app.set('views', 'templates');
app.set('view engine', 'tmpl');

app.use(express.static('sketches'));

app.get('/:sketch', function (req, res) {
  var sketch = req.params.sketch;

  var attr = cg.getAttributes(sketch, function (err, attr) {
    var options = {
      attr: attr,
      scripts: ['/test/sketch.js']
    };
    res.render('sketch', options);
  });
});

app.get('/', function (req, res) {
  cg.getSketches(function (err, sketches) {
    if (err) rendererror(req, res, err);
    var options = {
      sketches: sketches
    };
    res.render('index', options);
  });
});

function rendererror(req, res, err) {
  res.render('error', { error: err });
}

app.listen(80, function () {
  console.log('Started on *:80');
});
