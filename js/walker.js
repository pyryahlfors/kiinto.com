var walker = {
    gridX : 0,
    gridY : 0,

    init: function(){
    // Create canvas
        this.canvas = document.createElement("canvas");
        document.querySelector('.intro').appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.background = "transparent";

        this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.canvas.height  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


        this.gridX = this.canvas.width / 2;
        this.gridY = this.canvas.height / 2;

        var updatewalkerSize = function(){
            this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        };

        this.touchEvent = (function(){
			var testTouch = document.createElement("DIV");
			testTouch.setAttribute('ontouchstart', 'return;');
			var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
			return (isTouchDevice) ? 'touchmove' : 'mousemove';
			})();

        var moveGrid = function(evt){
            var temp = evt;
            if(evt.touches && evt.touches.length) {
                temp = evt.touches[0];
            }
            if(temp.clientY + window.scrollY > this.canvas.height) {return;}
            this.gridX = temp.clientX;
            this.gridY = temp.clientY + window.scrollY;
        }

        window.addEventListener('resize', updatewalkerSize.bind(this), false);
        window.addEventListener(this.touchEvent, moveGrid.bind(this), false);
        this.generateNodes();
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
        // Determine original X-axis speed based on setting limitation
        this.vx = Math.random() * 20 - 10;
        this.vy = Math.random() * 20 - 10;

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        params.mother.particleIndex++;
        params.mother.walker[params.mother.particleIndex] = this;
        this.id = params.mother.particleIndex;
        this.life = 0;

        this.generateNodes = function(params){
            this.xs = params.mother.settings.startingX;
            this.ys = params.mother.settings.startingY;
            this.x += this.vx;
            this.y += this.vy;

            // Adjust for gravity
            this.vy += params.mother.settings.gravity;

            // Age the particle
            this.life++;

            this.size = 1+this.life/4;
            if (this.x < 0 || this.x > Math.max(document.documentElement.clientWidth, window.innerWidth) || this.y < 0 || this.y > Math.max(document.documentElement.clientHeight, window.innerHeight)) {
                delete params.mother.walker[this.id];
            }

            params.mother.ctx.fillStyle = "rgba("+params.mother.colorCycleTable[Math.round(params.mother.colorCycle)]+", "+(100-this.life)/100+")";
            params.mother.ctx.strokeStyle = "rgba("+params.mother.colorCycleTable[Math.round(params.mother.colorCycle)]+", "+(100-this.life)/100+")";

            params.mother.ctx.beginPath();
            params.mother.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            params.mother.ctx.stroke();
            params.mother.ctx.closePath();

            params.mother.ctx.beginPath();
            params.mother.ctx.moveTo(this.xs, this.ys); //, this.size, 0, Math.PI * 2, true);
            params.mother.ctx.lineTo(this.x, this.y); //, this.size, 0, Math.PI * 2, true);
            params.mother.ctx.stroke();
            params.mother.ctx.closePath();


            for(var i in params.mother.walker){
                if(params.mother.walker[i] !== this){
                    params.mother.ctx.beginPath();
                    params.mother.ctx.moveTo(this.x, this.y); //, this.size, 0, Math.PI * 2, true);
                    params.mother.ctx.quadraticCurveTo(this.xx, this.yy, params.mother.walker[i].x, params.mother.walker[i].y);
                    params.mother.ctx.stroke();
                    params.mother.ctx.closePath();
                }
            }
        };
    },

    generateNodes: function(){
        this.randomNodesTop = Array(Math.round(Math.random()*10 + 5));
        for(var i=0, j=this.randomNodesTop.length; i<j;i++){
            this.randomNodesTop[i] = [30 + (Math.round(Math.random()*(this.canvas.width-60))),20];
        }
        this.randomNodesTop.sort();

        this.randomNodesBottom = Array(Math.round(Math.random()*10 + 5));
        for(var i=0, j=this.randomNodesBottom.length; i<j;i++){
            this.randomNodesBottom[i] = [30 + (Math.round(Math.random()*(this.canvas.width-60))),20];
        }
        this.randomNodesTop.sort(function(a, b){return a[0]-b[0]});
        this.randomNodesBottom.sort(function(a, b){return a[0]-b[0]});
    },

    closest: function(num, arr){
        var curr = 0;
        var diff = Math.abs (num - arr[0][0]);
        for (var val = 0; val < arr.length; val++) {
            var newdiff = Math.abs (num - arr[val][0]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = val;
            }
        }
    return curr;
    },

    animate: function(){
        setInterval(function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#00cc00';
            this.ctx.strokeStyle = '#00cc00';


        for (var i =0, j=this.randomNodesTop.length; i<j;i++){
            this.ctx.fillRect(this.randomNodesTop[i][0], 20, 10, 10);
            }
        for (var i =0, j=this.randomNodesBottom.length; i<j;i++){
            this.ctx.fillRect(this.randomNodesBottom[i][0], this.canvas.height-40, 10, 10);
            }

            this.ctx.beginPath();
            var xStartTop = this.closest(this.gridX, this.randomNodesTop);
            var xStartBottom = this.closest(this.gridX, this.randomNodesBottom);

            if(xStartTop == this.randomNodesTop.length-1) {xStartTop = this.randomNodesTop.length-2}
            if(xStartBottom == this.randomNodesBottom.length-1) {xStartBottom = this.randomNodesBottom.length-2}
            var xEndTop = (xStartTop+1 < this.randomNodesTop.length) ? xStartTop+1 : xStartTop;
            var xEndBottom = (xStartBottom+1 < this.randomNodesBottom.length) ? xStartBottom+1 : xStartBottom;

            this.ctx.moveTo(this.randomNodesTop[xStartTop][0]+5, 25);
            this.ctx.lineTo(this.gridX, this.gridY);
            this.ctx.lineTo(this.randomNodesBottom[xStartBottom][0]+5, this.canvas.height-35);
            this.ctx.moveTo(this.randomNodesTop[xEndTop][0]+5, 30);
            this.ctx.lineTo(this.gridX, this.gridY);
            this.ctx.lineTo(this.randomNodesBottom[xEndBottom][0]+5, this.canvas.height-35);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fillRect(this.gridX-10, this.gridY-10, 20, 20);
    }.bind(this), 30);
    }
};
