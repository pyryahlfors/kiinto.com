var particles = {
    settings : {
        density: 5,
        startingX: 0,
        startingY: 0
        },

    particles : {},
    particleIndex: 0,

    init: function(){
		let nakki = document.createElement('div');
		nakki.className="intro";
		document.body.appendChild(nakki);

    document.body.style.margin = 0;
    document.body.style.background = `url(https://www.vaimo.com/wp-content/uploads/2017/03/start-bg2-mobile.jpg)`;
    document.body.style.backgroundSize = `cover`;

// Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.translate= 'translate3d(0,0,0)';
    document.querySelector('.intro').appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.background = "transparent";

    this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.canvas.height  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // this.canvas.width = this.canvas.width / 4;
	// this.canvas.height = this.canvas.height / 4;
	// this.canvas.style.width = `100%`;
	// this.canvas.style.height = `100%`;

    this.settings.startingX = this.canvas.width / 2;
    this.settings.startingY = this.canvas.height / 2;

    var updateparticlesSize = function(){
        this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    };

    window.addEventListener('resize', updateparticlesSize.bind(this), false);

    this.animate();
    },

    particle : function(params) {
        // Establish starting positions and velocities
        this.x = Math.random()*params.mother.canvas.width;
        this.y = Math.random()*params.mother.canvas.height;

        this.xs = Math.random()*params.mother.canvas.width; //params.mother.settings.startingX;
        this.ys = Math.random()*params.mother.canvas.height; //params.mother.settings.startingY;
        this.xx = this.x;
        this.yy = this.y;
        this.color = params.color;
        // Determine original X-axis speed based on setting limitation
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        params.mother.particleIndex++;
        params.mother.particles[params.mother.particleIndex] = this;
        this.id = params.mother.particleIndex;
        this.life = 0;
        this.gravity= Math.random()*1  -0.5;

        this.draw = function(params){
            this.xs = params.mother.settings.startingX;
            this.ys = params.mother.settings.startingY;
            this.x += this.vx;
            this.y += this.vy;
            this.gravity= Math.random()*1  -0.5;

            // Adjust for gravity
            this.vy += this.gravity;

            this.rgbAlpha = 0.5-(0.1*this.life);

            // Age the particle
            this.life+=0.1;

            this.size = 2 - ((this.life/2 > 2) ? 2 : this.life/2);

            if (this.x < 0 || this.x > Math.max(document.documentElement.clientWidth, window.innerWidth) || this.y < 0 || this.y > Math.max(document.documentElement.clientHeight, window.innerHeight) || this.life > 100) {
                delete params.mother.particles[this.id];
            }

            params.mother.ctx.fillStyle = `rgba(${this.color}, ${this.rgbAlpha})`;
            params.mother.ctx.strokeStyle = `rgba(${this.color}, ${this.rgbAlpha})`;

            params.mother.ctx.beginPath();
            params.mother.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            params.mother.ctx.fill();
            params.mother.ctx.stroke();
            params.mother.ctx.closePath();

//			this.blur(params);
        }
    },

	blur: function(params){
		let c = params.mother.canvas;
	    var ctx = params.mother.ctx
	    params.mother.ctx.globalAlpha = 0.3;

	    var offset = 0;

	    for (var i=1; i<=8; i+=1) {
	        params.mother.ctx.drawImage(c, offset, 0, c.width - offset, c.height, 0, 0, c.width-offset, c.height);
	        params.mother.ctx.drawImage(c, 0, offset, c.width, c.height - offset, 0, 0,c.width, c.height-offset);
	    }
	},

    animate: function(){
        setInterval(function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.settings.density; i++) {
                if (Math.random() > 0.97) {
                    new this.particle({
                        color: "255,255,255",
                        mother : this
                    });
                }
            }
            for (var i in this.particles) {
                this.particles[i].draw({mother: this});
            }
			this.blur({mother: this});
        }.bind(this), 30);
    }
};


particles.init();
