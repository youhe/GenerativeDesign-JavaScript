class Agent {
  constructor() {
    this.p = {x: 0, y: 0};
    this.p.x = Math.floor(Math.random() * width);
    this.p.y = Math.floor(Math.random() * height);
    // this.p.x = width / 2;
    // this.p.y = height / 2;

    this.pOld = {x: this.p.x, y: this.p.y};
    this.stepSize = Math.floor(Math.random() * 6) + 2;
    this.angle;
    this.isOutside = false;
    this.life = 1000;
    this.noiseStrength = Math.random() * 0.1 + 0.01;
  }

  update() {
    var data = nContext.getImageData(
      this.p.x / noiseScale,
      this.p.y / noiseScale,
      1, 1
    ).data;
    this.angle = data[0];
    this.angle *= noiseStrength;

    this.p.x += Math.cos(this.angle) * this.stepSize;
    this.p.y += Math.sin(this.angle) * this.stepSize;

    if(this.p.x < -10) this.isOutside = true;
    else if(this.p.x > width + 10) this.isOutside = true;
    else if(this.p.y < -10) this.isOutside = true;
    else if(this.p.y > height + 10) this.isOutside = true;

    this.life = this.life - 1;
    if (this.life <= 0) this.isOutside = true;

    if (this.isOutside) {
      this.p.x = Math.floor(Math.random() * width);
      this.p.y = Math.floor(Math.random() * height);
      // this.p.x = width / 2;
      // this.p.y = height / 2;
      this.pOld.x = this.p.x;
      this.pOld.y = this.p.y;
      this.life = Math.floor(Math.random() * 400);
      this.life = 1000;
    }

    context.lineWidth = .6;
    context.beginPath();
    context.moveTo(this.pOld.x, this.pOld.y);
    context.lineTo(this.p.x, this.p.y);
    context.stroke();

    this.pOld.x = this.p.x;
    this.pOld.y = this.p.y;

    this.isOutside = false;
  }
};
