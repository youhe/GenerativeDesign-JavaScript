class Agent {
  constructor(color) {
    this.color = color;
    this.kx = 0.001;
    // this.kx = random(0.01, 0.01);
    this.ky = 0.001;
    // this.ky = random(0.01, 0.01);
    this.f = 0.95;
    var r = random(0.8, 0.99);
    this.fx = r;
    this.fy = r;
    this.x = width / 2;
    this.ax = 0;
    this.vx = 0;
    this.y = height / 2;
    this.ay = 0;
    this.vy = 0;

    this.ox = this.x;
    this.oy = this.y;
  }

  draw(x, y) {
    this.ox = this.x;
    this.oy = this.y;

    this.ax = (x - this.x) * this.kx;
    this.vx += this.ax;
    this.x  += this.vx;
    this.x *= this.fx;

    this.ay = (y - this.y) * this.ky;
    this.vy += this.ay;
    this.y  += this.vy;
    this.y *= this.fy;

    var sub = Math.abs(x - this.x) + Math.abs(y - this.y);
    var r = 10 - (sub * 0.001);

    // context.strokeStyle = '#00f';
    // context.fillStyle = '#00f';
    // context.globalAlpha = .3;
    // context.beginPath();
    // context.arc(this.x, this.y, r, 0, Math.PI * 2, false);
    // context.fill();

    context.globalCompositeOperation = 'screen';
    context.strokeStyle = this.color;
    context.globalAlpha = 1;
    context.lineWidth = 2;
    context.lineWidth = this.y / 400;
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.ox, this.oy);
    context.stroke();
  }
}