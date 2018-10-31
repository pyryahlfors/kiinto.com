let particles = {
    settings : {
        density: 100,
        startingX: 0,
        startingY: 0
        },
/*
    colorCycle : 0,
    colorCycleSeed :  [[255,0,0],[255,0,255],[0,0,255],[0,255,255],[0,255,0],[255,255,0],[255,0,0]],
    colorCycleSize : 255,
    colorCycleTable : [],
*/
    particles : {},
    particleIndex: 0,

    init: function(){
// Create color cycle table
/*
        let tempArr = [];
        let colorWidth = Math.round(this.colorCycleSize / (this.colorCycleSeed.length-1));
        for(let i=1; i<this.colorCycleSeed.length; i++) {
        	for(let j=0; j<=colorWidth; j++) {
        		let rr = Math.floor(this.colorCycleSeed[i-1][0] - ((this.colorCycleSeed[i-1][0] - this.colorCycleSeed[i][0])/colorWidth*j));
        		let gr = Math.floor(this.colorCycleSeed[i-1][1] - ((this.colorCycleSeed[i-1][1] - this.colorCycleSeed[i][1])/colorWidth*j));
        		let br = Math.floor(this.colorCycleSeed[i-1][2] - ((this.colorCycleSeed[i-1][2] - this.colorCycleSeed[i][2])/colorWidth*j));
                tempArr.push([rr, gr, br]);
        		}
        	}
        this.colorCycleTable = tempArr;

*/
// Create canvas
    this.canvas = document.createElement("canvas");
    document.querySelector('.intro').appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.background = "transparent";

    this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.canvas.height  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    this.settings.startingX = this.canvas.width / 2;
    this.settings.startingY = this.canvas.height / 2;

    let updateparticlesSize = function(){
        this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    };

    let updateCenterPoint = function(evt){
        let temp = evt;
        if(evt.touches && evt.touches.length) {
            temp = evt.touches[0];
        }
        if(temp.clientY + window.scrollY > this.canvas.height) {return;}
        this.settings.startingX = temp.clientX;
        this.settings.startingY = temp.clientY + window.scrollY;
    };

    this.touchEvent = (function(){
        let testTouch = document.createElement("DIV");
        testTouch.setAttribute('ontouchstart', 'return;');
        let isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
        return (isTouchDevice) ? 'touchmove' : 'mousemove';
        })();

    window.addEventListener('resize', updateparticlesSize.bind(this), false);
    window.addEventListener(this.touchEvent, updateCenterPoint.bind(this), false);

    this.animate();
    },

    particle : function(params) {
        // Establish starting positions and velocities
        this.x = params.mother.settings.startingX;
        this.y = params.mother.settings.startingY;
        this.xs = params.mother.settings.startingX;
        this.ys = params.mother.settings.startingY;
        this.xx = this.x;
        this.yy = this.y;
        this.color = params.color;
		this.counter = params.counter;
        // Determine original X-axis speed based on setting limitation
        this.vx = Math.random() * 40 - 20;
        this.vy = Math.random() * 40 - 20;

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        params.mother.particleIndex++;
        params.mother.particles[params.mother.particleIndex] = this;
        this.id = params.mother.particleIndex;
        this.life = 0;
        this.history = [];
		this.randomSeed = [1,-1][Math.round(Math.random()*1)];

        this.gravity= this.randomSeed * (Math.random()*1 - 0.5);
		this.gravity= Math.random()*1 - 0.5;

        this.draw = function(params){
			let randomizeSeed = [1,-1][Math.round(Math.random()*1)];
            this.xs = params.mother.settings.startingX;
            this.ys = params.mother.settings.startingY;
            this.x += randomizeSeed* this.vx;
            this.y += randomizeSeed* this.vy;
            this.gravity=  randomizeSeed * Math.random()*0.5;
//			this.gravity=  Math.random()*0.5;

            // Adjust for gravity
            this.vy *= this.gravity;

            this.rgbAlpha = 1-(0.1*this.life);

            // Age the particle
            this.life+=0.1;

            if (this.x < 0 || this.x > Math.max(document.documentElement.clientWidth, window.innerWidth) || this.y < 0 || this.y > Math.max(document.documentElement.clientHeight, window.innerHeight) || this.life > 200 || this.rgbAlpha < 0) {
                delete params.mother.particles[this.id];
            }

//            params.mother.ctx.strokeStyle = 'rgba('+this.color+','+this.rgbAlpha+')';
			params.mother.ctx.strokeStyle = `hsla(${this.counter}, 100%, 50%, ${this.rgbAlpha})`;
            params.mother.ctx.beginPath();

            for(let i=1, j=this.history.length; i<j;i++){
                this.history[i-1][0] = this.history[i-1][0]+Math.random()*2;
                this.history[i-1][1] = this.history[i-1][1]+Math.random()*2;
                params.mother.ctx.moveTo(this.history[i-1][0], this.history[i-1][1]);
                params.mother.ctx.lineTo(this.history[i][0], this.history[i][1]);

            }
            params.mother.ctx.stroke();
//            params.mother.ctx.closePath();
            this.history.push([this.x, this.y]);

            if(this.history.length > 30) {
                this.history.splice(0,1);
            }

        };
    },


    animate: function(){
		let counter = 0;
        setInterval(function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = `hsla(${counter}, 100%, 50%, 0.1)`;
			//"rgba("+this.colorCycleTable[Math.round(this.colorCycle)]+",.1)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.settings.density; i++) {
                if (Math.random() > 0.99) {
                    new this.particle({
//                        color: this.colorCycleTable[Math.round(this.colorCycle)],
                        mother : this,
						counter: counter
                    });
                }
            }
            for (let i in this.particles) {
                this.particles[i].draw({mother: this});
            }
//            this.colorCycle+=+0.5;
			counter++;
			if( counter >= 360 ) {
				counter = 0;
			}
//            if(this.colorCycle > this.colorCycleTable.length-1){this.colorCycle = 0;}
        }.bind(this), 30);
    }
};


particles.init();
