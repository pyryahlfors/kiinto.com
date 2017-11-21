// Plasma
var lSystem = function(mother) {
    this.pixelRatio = (window.devicePixelRatio) ? Math.floor(window.devicePixelRatio) : 1;

    this.canvas = document.createElement("canvas");

	this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    this.canvas.width = this.canvasWidth*this.pixelRatio;
    this.canvas.height = this.canvasHeight*this.pixelRatio;

    this.canvas.style.width = this.canvasWidth+"px";
    this.canvas.style.height = this.canvasHeight+"px";
    this.len = 300;

    document.querySelector('.intro').appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

	var updateCanvasSize = function(){
		this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.canvas.width = this.canvasWidth / 2;
		this.canvas.height = this.canvasHeight / 2;

		this.canvas.style.width = this.canvasWidth+"px";
		this.canvas.style.height = this.canvasHeight+"px";
	};

	window.addEventListener('resize', updateCanvasSize.bind(this), false);

    this.axiom = "F"; //−G−G";
    document.addEventListener('click', function(){
//    this.generate(this.axiom, [{a: "X", b: "F−[[X]+X]+F[+FX]−X"}, {a: "F", b: "FF"}], this.len, 25);
      this.generate(this.axiom, [{a: "F", b: "FF+[+F-F-F]-[-F+F+F]"}], this.len, 25);
    }.bind(this), false);
};

lSystem.prototype.generate = function(axiom, rules, len, angle){
      this.len = len* 0.5;
      this.angle = (Math.PI/180)*angle;
      var nextSentence = "";
      for (var i = 0; i < axiom.length; i++) {
        var current = axiom.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++) {
          if (current == rules[j].a) {
            found = true;
            nextSentence += rules[j].b;
            break;
          }
        }
        if (!found) {
          nextSentence += current;
        }
      }
      this.axiom = nextSentence;
      this.turtle();
}

lSystem.prototype.turtle = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.resetTransform();

    this.ctx.strokeStyle = "rgba(0,255,0,1)";
    this.ctx.fillStyle = "rgba(0,255,0,1)";

    this.ctx.translate(this.canvasWidth / 2*this.pixelRatio, this.canvasHeight*this.pixelRatio);

    this.ctx.beginPath();
    this.history = [];
    for (var i = 0; i < this.axiom.length; i++) {
      var current = this.axiom.charAt(i);
      if (current == "F") {
          this.ctx.moveTo(0,0);
          this.ctx.lineTo(0, -this.len);
          this.ctx.translate(0, -this.len);
      }

      if (current == "+") {
        this.ctx.rotate(this.angle);
      }
      if (current == "-") {
        this.ctx.rotate(-this.angle);
      }
      if (current == "[") {
          this.ctx.save();

      }
      if (current == "]") {
          this.ctx.restore();
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
};
