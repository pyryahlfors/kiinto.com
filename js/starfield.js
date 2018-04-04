/*jshint esversion: 6 */

let starfield = {
    settings : {
        density: 50,
        startingX: 0,
        startingY: 0,
        gravity: 0,
        cx : 0,
        cy: 0
        },
    colorCycle : 0,
    colorCycleSeed :  [[255,0,0],[255,0,255],[0,0,255],[0,255,255],[0,255,0],[255,255,0],[255,0,0]],
    colorCycleSize : 255,
    colorCycleTable : [],

    particles : {},
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

    var updateStarfieldSize = function(){
        this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
				this.settings.startingX = this.canvas.width / 2;
		    this.settings.startingY = this.canvas.height / 2;
    };

    var updateHeading = function(e){
      if(!e) e = window.event;
	  if(e.clientY < (window.innerHeight || document.documentElement.clientHeight)) {
	      this.settings.cx = (e.clientX - this.canvas.width / 2);
	      this.settings.cy = (e.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - this.canvas.height / 2);
	  }
    };
    // mouse position to head towards

    window.addEventListener('resize', updateStarfieldSize.bind(this), false);
    window.addEventListener('mousemove', updateHeading.bind(this), false);

    requestAnimationFrame(this.animate.bind(this));
    },

	isElementInViewport: function() {
		const rect = this.canvas.getBoundingClientRect();
		return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.top < (window.innerHeight || document.documentElement.clientHeight);
	},

    animate: function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = `rgba(${this.colorCycleTable[Math.round(this.colorCycle)]}, .1)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.settings.density; i++) {
            if (Math.random() > 0.97) {
                new particle({
                    color: this.colorCycleTable[Math.round(this.colorCycle)],
                    mother : this
                });
            }
        }

        for (let j in this.particles) {
            this.particles[j].draw({mother: this});
        }

        this.colorCycle+=0.5;
        if(this.colorCycle > this.colorCycleTable.length-1){this.colorCycle = 0;}
    	requestAnimationFrame(this.animate.bind(this));
    }
};

class particle {
  constructor(params) {
    // Establish starting positions and velocity
    this.x = params.mother.settings.startingX;
    this.y = params.mother.settings.startingY;

    this.xx = this.x;
    this.yy = this.y;

    this.color = params.color;

    this.vx = Math.random() * 20 - 10;
    this.vy = Math.random() * 20 - 10;

    // Add new particle to the index
    params.mother.particleIndex++;
    params.mother.particles[params.mother.particleIndex] = this;
    this.id = params.mother.particleIndex;
    this.life = 0;
  }

  draw(params){
      this.x += this.vx;
      this.y += this.vy;

      // Adjust for gravity
      this.vy += params.mother.settings.gravity;

      // Age the particle
      this.life++;
      let alpha = this.life/50;
      this.alpha = (alpha > 1) ? 1 : alpha;


      if (this.x+params.mother.settings.cx < 0 ||
        this.y + params.mother.settings.cy < 0 ||
        this.x +params.mother.settings.cx > Math.max(document.documentElement.clientWidth, window.innerWidth) ||
        this.y + params.mother.settings.cy> Math.max(document.documentElement.clientHeight, window.innerHeight)) {
          delete params.mother.particles[this.id];
      }

      params.mother.ctx.beginPath();
      params.mother.ctx.lineWidth = 2;
      params.mother.ctx.strokeStyle = `rgba(${this.color+','+this.alpha})`;
      params.mother.ctx.moveTo(params.mother.settings.cx + this.xx, params.mother.settings.cy + this.yy);
      params.mother.ctx.lineTo(params.mother.settings.cx + this.x, params.mother.settings.cy + this.y);
      params.mother.ctx.stroke();
      this.xx = this.x;
      this.yy = this.y;
  }
}

starfield.init();
