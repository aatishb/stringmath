// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here

    p.setup = function() {
      let canvas = p.createCanvas(400, 200);
      canvas.parent(parent.$el);

      p.noFill();
      p.stroke(255);
      p.strokeWeight(5);
      p.noLoop();
      drawStuff();
    };


    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      drawStuff();
    };

    p.playPause = function(isVisible) {
    }

    drawStuff = function() {

      let t = p.millis()/1000;
      let c = 600;
      let l = parent.data.l;
      let N = parent.data.N;

      p.background(0);
      //p.rect(parent.data.x, parent.data.y, 50, 50);
      p.beginShape();
      for(let t=0; t<5; t+=0.001) {

        let y = 0;

        for (let n=1; n<=N; n++) {
          let k = n * p.PI / p.width;
          let w = c * k;
          let a = (1/Math.pow((n*p.PI),2)) * (2/(l * (1-l))) * (p.sin(n * p.PI * l) - l * p.sin(n * p.PI));

          y += a * p.cos(w * t);

        }

        y = p.map(y, -1.5, 1.5, 0, p.height);
        p.vertex(t* p.width / 5, y);
      }
      p.endShape();
    }

  };
}