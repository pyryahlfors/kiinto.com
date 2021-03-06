let particles = {
    settings : {
        density: 50,
        startingX: 0,
        startingY: 0
        },

    particles : {},
    particleIndex: 0,

    init: function(){
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

    animate: function(){
		let counter = 180;
        setInterval(function() {
            this.ctx.fillStyle = `hsl(${counter}, 100%, 5%)`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.settings.density; i++) {
                if (Math.random() > 0.98) {
                    new particle({
                        mother : this,
						counter: counter
                    });
                }
            }
            for (let i in this.particles) {
                this.particles[i].draw({mother: this});
            }
			counter++;
			if( counter >= 360 ) {
				counter = 0;
			}
        }.bind(this), 30);
    }
};

class particle {
	constructor(params) {
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
		this.vy = -20 + Math.random() * 40;

		// Add new particle to the index
		// Object used as it's simpler to manage that an array
		params.mother.particleIndex++;
		params.mother.particles[params.mother.particleIndex] = this;
		this.id = params.mother.particleIndex;
		this.life = 0;
		this.history = [];
		this.randomSeed = [1,-1][Math.round(Math.random()*1)];

		this.gravity= Math.random()*1 - 0.5;
	}

	draw(params) {
		let randomizeSeed = [1,-1][Math.round(Math.random()*1)];
		this.xs = params.mother.settings.startingX;
		this.ys = params.mother.settings.startingY;
		this.x += randomizeSeed* this.vx;
		this.y += randomizeSeed* this.vy;
		this.gravity = randomizeSeed * Math.random()*1.5;

		// Adjust for gravity
		this.vy *= this.gravity;

		this.rgbAlpha = 1-(0.1*this.life);

		// Age the particle
		this.life+=0.1;

		if (this.x < 0 || this.x > Math.max(document.documentElement.clientWidth, window.innerWidth) || this.y < 0 || this.y > Math.max(document.documentElement.clientHeight, window.innerHeight) || this.life > 200 || this.rgbAlpha < 0) {
			delete params.mother.particles[this.id];
			}

		params.mother.ctx.strokeStyle = `hsla(${this.counter}, 100%, 50%, ${this.rgbAlpha})`;
		params.mother.ctx.beginPath();

		for(let i=1, j=this.history.length; i<j;i++){
			this.history[i-1][0] = this.history[i-1][0]+Math.random()*2;
			this.history[i-1][1] = this.history[i-1][1]+Math.random()*2;
			params.mother.ctx.lineTo(this.history[i][0], this.history[i][1]);
			params.mother.ctx.moveTo(this.history[i-1][0], this.history[i-1][1]);
		}
		params.mother.ctx.stroke();

		this.history.push([this.x, this.y]);

		if(this.history.length > 30) {
			this.history.splice(0,1);
		}
	}
}

particles.init();
