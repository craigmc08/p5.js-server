return function(c) {
    var b = '<html><head>  <title>p5.js Server</title></head><body>  <ul>    ';
    var __sketch = g(c, 'sketch');
    var sketchA = g(c, 'sketches');
    for (var sketchI = 0; sketchI < sketchA.length; sketchI++) {
        c['sketch'] = sketchA[sketchI];
        b += '      <li><a href="' + g(c, 'sketch.folder') + '">' + g(c, 'sketch.name') + '</a>, description: ' + g(c, 'sketch.description') + ', author: ' + g(c, 'sketch.author') + '</li>    '
    }
    c['sketch'] = __sketch;
    b += '  </ul></body></html>';
    return b;
}
