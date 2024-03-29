// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let graph = parent.data.graph;

    p.setup = function() {
      let canvas = p.createCanvas(400, 200);
      canvas.parent(parent.$el);

      p.noFill();
      p.stroke(255);
      p.strokeWeight(5);
    };

    p.draw = function() {
      if (parent.isVisible) {

        let vars = Object.values(parent.data.vars);

        let t = p.millis()/1000;

        p.background(0);


        p.beginShape();

        for (let x=0; x<=1.001; x+=0.001) {

          let y = 0;
          y = graph(x,t,...vars);
          p.vertex(
            p.width * x,
            p.map(y, -1, 1, p.height, 0)
          );
        }

        p.endShape();

        if (parent.data.marker) {
          let l = parent.data.marker;
          let y =  graph(l,t,...vars);
          p.fill('#c31');
          p.noStroke();
          p.ellipse(
            p.width * l,
            p.map(y, -1, 1, p.height, 0),
            6);
          p.noFill();
          p.stroke(255);
        }
      }
    };

    p.mouseClicked = function() {
      if (p.mouseY > 0 && p.mouseY < p.height) {
        console.log(parent.data);
      }
    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
    };

    p.playPause = function(isVisible) {
    }

  };
}