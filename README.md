# p5.js-server
Makes playing with [p5.js] a lot easier.

### How To Use
1. Clone the respository
2. Make sure you have [node.js] installed.
3. Navigate to the directory you cloned this in.
4. Run "node server.js"
5. Add projects (folders) in /sketches. Any .js files you add will be automatically included in an automatically generated HTML page. p5.js is automatically included
6. To open your project, go to [localhost] in your browser.
7. Look for your project on the list and click on it, it should load.


### Making a .attr File for Your Project
You can add some descriptions and better names for projects using a .attr file. There are three things you can have:
- -name: The name of this project (for example: Pancake Generator)
- -description: The description of this project (for example: A program that creates random pancakes and draws them)
- -author: Who made this (for example: Pancakelover123)
Using the examples, you could construct a .attr file that looks like this:
```
-name Pancake Generator -description A program that creates random pancakes and draws them -author Pancakelover123
```

[p5.js]: <https://p5js.org/>
[node.js]: <http://nodejs.org/>
[localhost]: <http://localhost>
