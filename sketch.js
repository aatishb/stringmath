// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    if (parent.data.code) {
      try {
        eval(parent.data.code);
      } catch(error) {
        console.log(parent.data.code);
        console.log(error);
      }
    }
    let data = parent.data.variables;

    p.setup = function() {
      let canvas = p.createCanvas(400, 400);
      canvas.parent(parent.$el);

      setup();
    };


    p.draw = function() {
      if (parent.isVisible) {
        draw();
      }
    };
    
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      data = val.variables;
    };

    /*

    p.mouseClicked = function() {
      if (p.mouseY > 0 && p.mouseY < p.height) {
        //console.log(parent.data);
      }
    };

    // this is a new function we've added to p5
    // it runs only if the data changes

    */

  };
}