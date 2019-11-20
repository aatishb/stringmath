Vue.component('animation', {

  template: `
  <div>
    <div class="center">

      <div class="center-inline" v-for="s in sliders">
        <div> {{s[0]}} {{getVarName(s)}} = {{vars[getVarName(s)]}} </div>
        &nbsp;&nbsp;
        <input type="range" :min="s[1]" :max="s[2]" :step="s[3]"
          v-model.number="vars[getVarName(s)]"></input>
      </div>

      <slot></slot>

    </div>

  <p5 v-if="code" src="./drawGraph.js" :data="{vars: vars, graph: graph}"></p5>

  </div>
  `,

  props: ['vars', 'sliders', 'code'],

  methods: {
    getVarName(val) {
      return Object.keys(this.sliders).find(key => this.sliders[key] == val);
    },

    getVar(val) {
      return this.vars[this.getVarName(val)];
    },

    calculate() {
      console.log(this.graph(0.5, 0.1, ...Object.values(this.vars)));
    }
  },

  data: function() {
    return {
      graph: NaN
    }
  },

  mounted() {
    //let code = this.code;
    //this.$refs.animation.innerHTML = '';
    //console.log('animation component mounted');

    if (this.code) {
      try {

        eval(this.code);
        // console.log(code);
        this.graph = graph;
        // console.log(this.vars);
        //console.log(this.sliders['a']);
        //console.log(this.getSliderName(this.sliders['a']));
        // console.log(this.graph(0.5, 0.1, ...Object.values(this.vars)));

      } catch(error) {

        console.log(code);
        console.log(error);

      }
    }
  }

});

// custom markdown component
Vue.component('md', {

  template: '<div ref="markdown" style="width: 100%"><slot></slot></div>',

  mounted() {
    // katex marked mashup from https://gist.github.com/tajpure/47c65cf72c44cb16f3a5df0ebc045f2f
    // slightly modified to pass displayMode variable to the katex renderer

    let inputHTML = this.$refs.markdown.innerHTML;
    let parsedHTML = this.convertHTML(inputHTML);
    this.$refs.markdown.innerHTML = marked(parsedHTML);
  },

  methods: {

    convertHTML(text) {

      const blockRegex = /\$\$[^\$]*\$\$/g
      const inlineRegex = /\$[^\$]*\$/g
      let blockExprArray = text.match(blockRegex)
      let inlineExprArray = text.match(inlineRegex)

      for (let i in blockExprArray) {
        const expr = blockExprArray[i]
        const result = this.renderMathsExpression(expr)
        text = text.replace(expr, result)
      }

      for (let i in inlineExprArray) {
        const expr = inlineExprArray[i]
        const result = this.renderMathsExpression(expr)
        text = text.replace(expr, result)
      }

      return text;
    },

    renderMathsExpression(expr) {

      if (expr[0] === '$' && expr[expr.length - 1] === '$') {
        let displayMode = false
        expr = expr.substr(1, expr.length - 2)
        if (expr[0] === '$' && expr[expr.length - 1] === '$') {
          displayMode = true
          expr = expr.substr(1, expr.length - 2)
        }
        let html = null

        try {

          // ugly hack for now
          while(expr.includes('&amp;')) {
            expr = expr.replace('&amp;', '&');
          }
          while(expr.includes('&lt;')) {
            expr = expr.replace('&lt;', '<');
          }
          while(expr.includes('&gt;')) {
            expr = expr.replace('&gt;', '>');
          }

          html = katex.renderToString(expr, {displayMode: displayMode})

        } catch (e) {

          console.log(expr);
          console.log(e);

        }

        if (displayMode && html) {
          html = html.replace(/class="katex"/g, 'class="katex katex-block" style="display: block;"')
        }
        return html
      } else {
        return null
      }
    }
  }

});


// custom graph component
Vue.component('graph', {

  props: ['traces', 'layout'],

  template: '<div ref="graph" class="graph" style="height: 600px;"></div>',

  methods: {

    makeGraph() {
      Plotly.newPlot(this.$refs.graph, this.traces, this.layout);
    },

  },

  mounted() {
    this.makeGraph();
  },

  watch: {
    traces() {
      this.makeGraph();
    }
  }
})

// custom p5 component

Vue.component('p5', {

  template: '<div v-observe-visibility="visibilityChanged"></div>',

  props: ['src','data'],

  methods: {
    // loadScript from https://stackoverflow.com/a/950146
    // loads the p5 javscript code from a file
    loadScript(url, callback)
    {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
    },

    loadSketch() {
      this.myp5 = new p5(sketch(this));
    },

    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible
      if(this.myp5.playPause) {
        this.myp5.playPause(isVisible);
      }
    }
  },

  data: function() {
    return {
      myp5: {},
      isVisible: false
    }
  },

  mounted() {
    this.loadScript(this.src, this.loadSketch);
  },

  watch: {
    data: {
      handler: function(val, oldVal) {
        if(this.myp5.dataChanged) {
          this.myp5.dataChanged(val, oldVal);
        }
      },
      deep: true
    }
  }
})

// global data
let app = new Vue({

  el: '#root',

  methods: {
    struckString(n,l) {
      return 2 * Math.sin(n * Math.PI * l)/(2 * Math.PI * n);
    },

    struckString2(n,l) {
      let k = n * Math.PI;
      return Math.pow(-1,n) * k *2 * Math.sin(n * Math.PI * l)/(2 * Math.PI * n);
    },

    pluckedString(n,l) {
      return (2/(l * (1-l))) * Math.sin(n * Math.PI * l) / Math.pow((n * Math.PI),2);
    },

    pluckedString2(n,l) {
      let k = n * Math.PI;
      return Math.pow(-1,n) * k * (2/(l * (1-l))) * Math.sin(n * Math.PI * l) / Math.pow((n * Math.PI),2);
    },

    playStruckString() {
      this.playString(this.struckString, e=>0);
    },

    playStruckString2() {
      this.playString(this.struckString2, e=>0);
    },

    playPluckedString() {
      this.playString(e=>0, this.pluckedString);
    },

    playPluckedString2() {
      this.playString(e=>0, this.pluckedString2);
    },

    playString(sinAmpFn, cosAmpFn) {
      let l = parseFloat(this.string.l);
      let N = parseInt(this.string.N);

      let zero = new Float32Array(N+1).fill(0);
      let real;
      let img;

      let sum = 0;

      let oscArray = [];

      for (let n = 1; n <= N; n++) {
        real = zero.slice();
        img = zero.slice();

        real[n] = cosAmpFn(n,l);
        img[n] = sinAmpFn(n,l);

        let osc = context.createOscillator();
        let wave = context.createPeriodicWave(real, img, {disableNormalization: true});

        osc.setPeriodicWave(wave);
        osc.frequency.value = this.freq;

        if( Math.abs(real[n]) > epsilon || Math.abs(img[n]) > epsilon ) {

          sum += Math.abs(real[n]);
          sum += Math.abs(img[n]);

          oscArray.push({
            osc: osc,
            index: n
          });
        }


      }

      let T = context.currentTime;
      let fadeTime = 1;

      let maxGain = 0.5/sum;

      for (let osc of oscArray) {
        let n = osc.index;
        let o = osc.osc;

        fade(o, T + 0.1, fadeTime/n, maxGain);
      }

      /*
      osc.connect(context.destination);

      let T = context.currentTime;
      osc.start(T);
      osc.stop(T+2);
      */

    }
  },

  computed: {
  },


  data: {

    freq: 220,

    stringnormalmodes: {
      n: 1,
      a: 1,
      b: 0
    },

    string: {
      N: 10,
      l: 0.1
    },

    mixingmodes: {
      c: 0,
      A1: 1,
      A2: 0,
      A3: 0,
      A4: 0,
      A5: 0,
      A6: 0,
    },

    trianglecurve: {
      l: 0.3,
      h: 1
    }
  }

})
