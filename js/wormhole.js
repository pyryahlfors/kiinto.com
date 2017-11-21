var wormhole = {
    settings : {
        density: 40,
        round: 0,
        },
    colorCycle : 0,
    colorCycleSeed :  [[255,0,0],[255,0,255],[0,0,255],[0,255,255],[0,255,0],[255,255,0],[255,0,0]],
    colorCycleSize : 255,

    colorCycleTable : [],

    wormhole : {},
    particleIndex: 0,

    init: function(){
// Create color cycle table
        var tempArr = [];
        var colorWidth = Math.round(this.colorCycleSize / (this.colorCycleSeed.length-1));
        for(var i=1; i<this.colorCycleSeed.length; i++) {
        	for(var j=0; j<=colorWidth; j++) {
        		var rr = Math.floor(this.colorCycleSeed[i-1][0] - ((this.colorCycleSeed[i-1][0] - this.colorCycleSeed[i][0])/colorWidth*j));
        		var gr = Math.floor(this.colorCycleSeed[i-1][1] - ((this.colorCycleSeed[i-1][1] - this.colorCycleSeed[i][1])/colorWidth*j));
        		var br = Math.floor(this.colorCycleSeed[i-1][2] - ((this.colorCycleSeed[i-1][2] - this.colorCycleSeed[i][2])/colorWidth*j));
                tempArr.push([rr, gr, br]);
        		}
        	}
        this.colorCycleTable = tempArr;

// Create canvas
      this.canvas = document.createElement("canvas");
      document.querySelector('.intro').appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.style.background = "transparent";

      this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      this.canvas.height  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      this.settings.startingX = this.canvas.width / 2;
      this.settings.startingY = this.canvas.height / 2;

      this.touchEvent = (function(){
          var testTouch = document.createElement("DIV");
          testTouch.setAttribute('ontouchstart', 'return;');
          var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
          return (isTouchDevice) ? 'touchmove' : 'mousemove';
          })();


      this.animate()
    },

    particle : function(params) {
        // Establish starting positions and velocities
        this.x = null;
        this.y = null;
        this.xs = null;
        this.ys = null;
        this.radMX = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)/5;
        this.radMY = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/5;
        this.radius = Math.min(this.radMX, this.radMY);
        this.color = params.mother.colorCycleTable[Math.round(params.mother.colorCycle)];

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        params.mother.particleIndex++;
        params.mother.wormhole[params.mother.particleIndex] = this;
        this.id = params.mother.particleIndex;
        this.count = params.count;

        this.draw = function(params){
            this.xs = (Math.sin((params.mother.settings.round+this.count*10) * (Math.PI/this.radMX)) * this.radius);
            this.ys = (Math.cos((params.mother.settings.round+this.count*10) * (Math.PI/this.radMY)) * this.radius);

            this.size = 100+(this.count*Math.PI*this.count/2);

            this.x = this.xs+this.size/2;
            this.y = this.ys+this.size/2;

            this.rgbAlpha = (0.1*this.count);

            //params.mother.ctx.fillStyle = `rgba(${params.color}, ${this.rgbAlpha})`;
            params.mother.ctx.strokeStyle = `rgba(${params.color}, ${this.rgbAlpha})`;

            params.mother.ctx.beginPath();
            params.mother.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            params.mother.ctx.stroke();
            params.mother.ctx.closePath();
        };
    },


    animate: function(){
      delete this.wormhole;
      this.wormhole= [];
      for (var i = 0; i < this.settings.density; i++) {
        new this.particle({
          'color': this.colorCycleTable[Math.round(this.colorCycle)],
          'mother' : this,
          'count': i
          });
        }

        setInterval(function() {
          this.settings.round++;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i in this.wormhole) {
                this.wormhole[i].draw({
                  mother: this,
                  color: this.colorCycleTable[Math.round(this.colorCycle)]
                });
            }
            this.colorCycle+=0.1;
            if(this.colorCycle > this.colorCycleTable.length-1){this.colorCycle = 0;}
        }.bind(this), 10);
    }
};
