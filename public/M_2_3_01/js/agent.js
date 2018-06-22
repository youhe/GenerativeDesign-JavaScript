class Agent {
  constructor(i) {
    this.index = i + 1;
    this.set();
    this.color = [
      ['#f00', '#a00'],
      ['#ff0', '#aa0'],
      ['#0f0', '#0a0'],
      ['#0ff', '#0aa'],
      ['#00f', '#00a'],
      ['#f0f', '#a0a'],
    ];
  }

  set() {
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    this.r1 = random(0, height);
    this.r2 = height * 0.5;
    this.r1 = width / this.index;
    this.r2 = height / this.index;
    this.r1 = width * -.1 + (this.index * 200.);
    this.r2 = height * -.1 + (this.index * 200.);

    // this.f1 = random(1, 4) / this.index;
    // this.f2 = random(1, 4) / this.index;
    this.f1 = this.index * .12;
    this.f2 = this.index * .4;
  }

  draw(frame) {
    context.globalCompositeOperation = 'screen';

    if (this.oldX != 0 && this.oldY != 0) {
      var colorIndex = Math.floor(Math.abs(this.x + this.y + this.index)) % this.color.length;

      context.strokeStyle = this.color[colorIndex][0];
      context.globalAlpha = .03;
      context.lineWidth = 30;
      context.beginPath();
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();

      context.strokeStyle = this.color[colorIndex][1];
      context.globalAlpha = .3;
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();

      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = '#000';
      context.globalAlpha = .8;
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
