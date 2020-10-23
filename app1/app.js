var canvas = document.querySelector('canvas');
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext('2d');

class Timer {
    constructor() {
        this.t0 = new Date().getTime();
    }
    restart() {
        this.t0 = new Date().getTime();
    }
    getTime() {
        return (new Date().getTime() - this.t0) / 1000;
    }
}

class Ball {
    constructor(x0, y0, radius) {
        this.x = x0;
        this.y = y0;
        this.x0 = this.x;
        this.y0 = this.y;
        this.radius = radius;
        this.timer = new Timer();
        this.v0 = 7 + Math.random() * 4;
        this.theta = Math.random() * Math.PI * 2;
        this.a_x = 0;
        this.a_y = -9.8;
        this.v_x0 = this.v0 * Math.cos(this.theta);
        this.v_y0 = this.v0 * Math.sin(this.theta);
        this.color = 'dodgerblue';
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, canvas.height - this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
    update() {
        let t = this.timer.getTime();
        let _x = this.x;
        let _y = this.y;
        this.x = (0.5 * this.a_x * Math.pow(t, 2) + this.v_x0 * t) * 32 + this.x0;
        this.y = (0.5 * this.a_y * Math.pow(t, 2) + this.v_y0 * t) * 32 + this.y0;
        let dy = _y-this.y;
        let dx = _x-this.x;
        this.theta = Math.atan2(dx, dy);

        
        if (this.y > canvas.height - this.radius) {
            this.theta += Math.PI/2;
            this.y0 = canvas.height - this.radius;
            this.y = canvas.height - this.radius;
            this.x0 = this.x;
            this.reset();
        }
        else if (this.y < this.radius) {
            this.theta += Math.PI/2;
            this.y0 = this.radius;
            this.x0 = this.x;
            this.y = this.radius;
            this.reset();
            this.v0 /= 1.2;
        }
        else if (this.x > canvas.width - this.radius) {
            this.theta = 3 * this.theta - Math.PI;
            this.y0 = this.y;
            this.x0 = canvas.width - this.radius;
            this.x = canvas.width - this.radius;
            this.reset();
        }
        else if (this.x < this.radius) {
            this.theta = 3 * this.theta - Math.PI;
            this.y0 = this.y;
            this.x0 = this.radius;
            this.x = this.radius;
            this.reset();
        }
    }
    reset() {
        this.timer.restart();
        this.v0 /= 1.07;
        this.v_x0 = this.v0 * Math.cos(this.theta);
        this.v_y0 = this.v0 * Math.sin(this.theta);
    }
}

// var b = new Ball(180, 280, 8);


var b = [];
function init() {
    let x = 32 + Math.random() * (canvas.width - 32);
    let y = 32 + Math.random() * (canvas.height - 32);
    for (let i=0; i<1024; i++) {
        b[i] = new Ball(x, y, 3);
    }
}

init();


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // b.update();
    // b.render();
    let mv = 0;
    for (let i=0; i<b.length; i++) {
        b[i].update();
        b[i].render();
        if (b[i].v0 > mv)
            mv = b[i].v0;
    }
    if (mv < 2) {
        init();
    }
}

animate();