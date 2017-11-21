// Plasma
var plasma = function(mother) {
    this.r = 64;
    this.g = 200; //Math.round(Math.random()*255);
    this.b = 255; //Math.round(Math.random()*255);

    this.colorCycle = 0;
    this.colorCycleSeed =  [[255,0,0],[255,0,255],[0,0,255],[0,255,255],[0,255,0],[255,255,0],[255,0,0]];
    this.colorCycleSize = 255;
    this.colorCycleTable = [];

/* Generate color cycle table */
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

    this.canvas = document.createElement("canvas");

	this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	this.canvas.width = this.canvasWidth / 2;
	this.canvas.height = this.canvasHeight / 2;

	this.canvas.style.width = this.canvasWidth+"px";
	this.canvas.style.height = this.canvasHeight+"px";

    document.querySelector('.intro').appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.animate(this.plasmaMap, this.colorMap);

	var updatePlasmaCanvasSize = function(){
		this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.canvas.width = this.canvasWidth / 2;
		this.canvas.height = this.canvasHeight / 2;

		this.canvas.style.width = this.canvasWidth+"px";
		this.canvas.style.height = this.canvasHeight+"px";
	};


	window.addEventListener('resize', updatePlasmaCanvasSize.bind(this), false);
};

plasma.prototype.draw = function(el, plasmaMap, colorMap) {
    this.colorCycle++;;
    if(this.colorCycle > this.colorCycleTable.length-1){this.colorCycle = 0;}
    var time = new Date().getTime() * 0.0005; // speed
    var w = this.canvas.width;
    var h = this.canvas.height;
    var imageData = el.getImageData(0, 0, w, h);

    var px = imageData.data;

    var kx = w / h;
    for (var y = 0; y < h; y += 4) {
        var yy = y / h;
        for (var x = 0; x < w; x += 4) {
            var xx = kx * x / w - kx / 2;
            var v = plasmaMap(xx, yy, time);
            colorMap(px, (y * w + x) * 4, v);
        };
    };
    el.putImageData(imageData, 0, 0);
};

plasma.prototype.still = function(plasmaMap, colorMap) {
    var context = this.canvas.getContext('2d');
    this.draw(context, plasmaMap, colorMap);
};

plasma.prototype.animate = function(plasmaMap, colorMap) {
    var context = this.canvas.getContext('2d');
    var self = this;
    this.timer = setInterval(function() {
        window.requestAnimationFrame(function() {
            self.draw(context, plasmaMap, colorMap.bind(self));
        });
    }, 30);

};

plasma.prototype.plasmaMap = function(x, y, time) {
    var v = 0;
    v+= Math.sin((x*10+time));
    v+= Math.cos((y*10+time)/2.0);
    v+= Math.sin((x*10+y*10+time)/2.0);
    var cx = x + .5 * Math.sin(time/5.0);
    var cy = y + .5 * Math.cos(time/3.0);
    v+= Math.sin(Math.sqrt(100*(cx*cx+cy*cy)+1)+time);
    v/=3; // thickness
    return v;
};

plasma.prototype.colorMap = function(px, offset, v) {
    px[offset] = this.colorCycleTable[Math.round(this.colorCycle)][0] - (255 * (.5 + .5 * Math.sin(Math.PI * v)));
    px[offset + 1] = this.colorCycleTable[Math.round(this.colorCycle)][1] - (255 * (.5 + .5 * Math.cos(Math.PI * v)));
    px[offset + 2] = this.colorCycleTable[Math.round(this.colorCycle)][2] - (255 * (.5 + .5 * Math.cos(Math.PI * v)));
    px[offset + 3] = 255; // alpha
};

plasma.prototype.kill = function() {
    clearInterval(this.timer);
};

(function() {
    var lastTime = 0;
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
