class Agent {
  constructor(i) {
    this.index = i;
    this.set();
  }

  set() {
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    // this.r1 = random(0, height * 0.5);
    // this.r2 = height * 0.5;
    this.r1 = width / this.index;
    this.r2 = height / this.index;
    this.f1 = random(1, 4) / this.index;
    this.f2 = random(1, 4) / this.index;
  }

  draw(frame) {
    context.globalCompositeOperation = 'screen';

    if (this.oldX != 0 && this.oldY != 0) {
      context.strokeStyle = '#f00';
      context.globalAlpha = .03;
      context.lineWidth = 20;
      context.beginPath();
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();

      context.strokeStyle = '#a00';
      context.globalAlpha = .1;
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();

      context.strokeStyle = '#fff';
      context.globalAlpha = .2;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();
    }

    this.oldX = this.x;
    this.oldY = this.y;

    this.x = Math.cos(frame * this.f1) * this.r1;
    this.x += width / 2;
    this.y = Math.sin(frame * this.f2) * this.r2;
    this.y += height / 2;

    // if (width < this.x) this.set();
  }
}
