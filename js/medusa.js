var medusa = {
    radiusX: 0.75,
    radiusY: 0.75,
    radSens: 100,
    tentacleCount: 50,

    radiusXCurve: 10,
    radiusYCurve: 10,
    radSensCurve: 100,

    animate: false,

    tentacles: [],

    pixelRatio: (window.devicePixelRatio) ? Math.floor(window.devicePixelRatio) : 1,

    init: function() {
        this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.centerizeX = (this.canvasWidth / 2) * this.pixelRatio;
        this.centerizeY = (this.canvasHeight / 2) * this.pixelRatio;

        this.canvas = document.createElement("CANVAS");
        document.querySelector('.intro').appendChild(this.canvas);

        this.canvasHolder = this.canvas.getContext("2d");

        this.canvas.width = this.canvasWidth * this.pixelRatio;
        this.canvas.height = this.canvasHeight * this.pixelRatio;

        this.canvas.style.width = this.canvasWidth + "px";
        this.canvas.style.height = this.canvasHeight + "px";

        for (var i = 0; i < this.tentacleCount; i++) {
            this.createTentacle();
        }
        var updatemedusaSize = function() {
            this.canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            this.canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            this.canvas.style.width = this.canvasWidth + "px";
            this.canvas.style.height = this.canvasHeight + "px";

            this.canvas.width = this.canvasWidth * this.pixelRatio;
            this.canvas.height = this.canvasHeight * this.pixelRatio;

        };

        window.addEventListener('resize', updatemedusaSize.bind(this), false);

        this.animate = setInterval(medusa.draw.bind(this), 40);
    },

    createTentacle: function() {
        var rotaDir = (Math.round(Math.random() * 1) === 0) ? -1 : 1;
        var testiDir = (Math.round(Math.random() * 1) === 0) ? -1 : 1;

        var tentacleY = this.centerizeY + ((-this.canvasHeight * this.pixelRatio) / 2) + Math.round(Math.random() * this.canvasHeight * this.pixelRatio);
        var tentacleX = this.centerizeX + ((-this.canvasWidth * this.pixelRatio) / 2) + Math.round(Math.random() * this.canvasWidth * this.pixelRatio);

        var tentacleXCurve = tentacleX + (this.centerizeX - tentacleX);
        var tentacleXCurveRnd = this.centerizeX - tentacleX;
        tentacleXCurve = tentacleXCurve - Math.round(Math.random() * tentacleXCurveRnd);

        var tentacleYCurve = this.centerizeY + ((tentacleY - this.centerizeY) / 2);
        var tentacleYCurveRnd = ((tentacleY - this.centerizeY) / 2);
        tentacleYCurve = tentacleYCurve - Math.round(Math.random() * tentacleYCurveRnd);

        var newTentacle = {
            tentacleY: tentacleY,
            tentacleX: tentacleX,
            tentacleXCurve: tentacleXCurve,
            tentacleYCurve: tentacleYCurve,
            rotaDir: rotaDir,
            testiDir: testiDir,
            testi: Math.random() * 360,
            teste: Math.random() * 360
        };

        this.tentacles.push(newTentacle);
        if (!this.animate) {
            medusa.draw();
        }
    },

    removeTentacle: function() {
        this.tentacles.splice(this.tentacles.length - 1);
        if (!this.animate) {
            medusa.draw();
        }
    },

    draw: function() {
        this.canvasHolder.clearRect(0, 0, this.canvasWidth * this.pixelRatio, this.canvasHeight * this.pixelRatio);
        this.canvasHolder.lineWidth = 1;

        for (var i = 0; i < this.tentacles.length; i++) {
            this.canvasHolder.beginPath();
            this.canvasHolder.lineWidth = 0.6;
            this.canvasHolder.strokeStyle = "rgb(200,200,200)";

            this.tentacles[i].testi += this.tentacles[i].testiDir;
            this.tentacles[i].teste += this.tentacles[i].rotaDir;

            cx = Math.sin(this.tentacles[i].testi * (Math.PI / this.radSensCurve)) * this.radiusXCurve;
            cy = Math.sin(this.tentacles[i].teste * (Math.PI / this.radSensCurve)) * this.radiusYCurve;

            this.tentacles[i].tentacleX = this.tentacles[i].tentacleX + Math.cos(this.tentacles[i].testi * (Math.PI / this.radSens)) * this.radiusX;
            this.tentacles[i].tentacleY = this.tentacles[i].tentacleY + Math.sin(this.tentacles[i].testi * (Math.PI / this.radSens)) * this.radiusY;

            // Draw tentacle
            this.canvasHolder.moveTo(this.centerizeX, this.centerizeY);
            this.canvasHolder.quadraticCurveTo(this.tentacles[i].tentacleXCurve + cx, this.tentacles[i].tentacleYCurve + cy, this.tentacles[i].tentacleX, this.tentacles[i].tentacleY);
            this.canvasHolder.stroke();
            this.canvasHolder.closePath();

            // Draw curve modifier
            this.canvasHolder.beginPath();
            this.canvasHolder.lineWidth = 2;
            this.canvasHolder.strokeStyle = "rgb(236,0,140)";
            this.canvasHolder.moveTo(cx + this.tentacles[i].tentacleXCurve - 5, cy + this.tentacles[i].tentacleYCurve);
            this.canvasHolder.lineTo(cx + this.tentacles[i].tentacleXCurve + 5, cy + this.tentacles[i].tentacleYCurve);
            this.canvasHolder.moveTo(cx + this.tentacles[i].tentacleXCurve, cy + this.tentacles[i].tentacleYCurve - 5);
            this.canvasHolder.lineTo(cx + this.tentacles[i].tentacleXCurve, cy + this.tentacles[i].tentacleYCurve + 5);
            this.canvasHolder.stroke();
            this.canvasHolder.closePath();
        }

        this.canvasHolder.beginPath();
        this.canvasHolder.strokeStyle = "rgb(128,128,128)";
        this.canvasHolder.lineWidth = 4;
        this.canvasHolder.arc(this.centerizeX, this.centerizeY, 25, 0, Math.PI * 2, true);
        this.canvasHolder.stroke();
        this.canvasHolder.closePath();

        this.canvasHolder.beginPath();
        this.canvasHolder.fillStyle = "rgb(200,200,200)";
        this.canvasHolder.arc(this.centerizeX, this.centerizeY, 10, 0, Math.PI * 2, true);
        this.canvasHolder.fill();
        this.canvasHolder.closePath();
    },

    pause: function() {
        if (this.animate !== false) {
            clearInterval(this.animate);
            this.animate = false;
        } else
            this.animate = setInterval(medusa.draw.bind(this),30);
        }
    };
