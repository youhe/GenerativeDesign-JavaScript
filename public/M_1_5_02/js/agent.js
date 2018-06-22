class Agent {
  constructor() {
    this.p = {x: 0, y: 0};
    this.p.x = Math.floor(Math.random() * width);
    this.p.y = Math.floor(Math.random() * height);

    this.pOld = {x: this.p.x, y: this.p.y};
    this.stepSize = Math.floor(Math.random() * 6) + 2;
    this.angle;
    this.isOutside = false;
    var c = hsvToRgb('rgb', Math.floor(Math.random() * 360), 100, 100);
    this.color = 'rgb('+c.r+','+c.g+','+c.b+')';
    this.noiseStrength = Math.floor(Math.random() * 10) * 0.01 + 0.01;
  }

  update() {
    var nData = nContext.getImageData(
      this.p.x / noiseScale,
      this.p.y / noiseScale,
      1, 1
    ).data;
    this.angle = nData[0];
    this.angle *= noiseStrength;


    this.p.x += Math.cos(this.angle) * this.stepSize * agentSpeed;
    this.p.y += Math.sin(this.angle) * this.stepSize * agentSpeed;

    if(this.p.x < canvasFrame) this.isOutside = true;
    else if(this.p.x > width - canvasFrame) this.isOutside = true;
    else if(this.p.y < canvasFrame) this.isOutside = true;
    else if(this.p.y > height - canvasFrame) this.isOutside = true;

    if (this.isOutside) {
      this.p.x = Math.floor(Math.random() * (width - (canvasFrame*2))) + canvasFrame;
      this.p.y = Math.floor(Math.random() * (height - (canvasFrame*2))) + canvasFrame;
      this.pOld.x = this.p.x;
      this.pOld.y = this.p.y;
      this.life = Math.floor(Math.random() * 400);
      this.life = 1000;
    }

    if (agentColorRandom) context.strokeStyle = this.color;
    // var d = map(this.p.x + this.p.y, 0, 1600, 60, 0);
    // context.lineWidth = strokeWidth + d;

    context.lineWidth = agentLineWidth;

    if (agentShape == 'line') {
      context.beginPath();
      context.moveTo(this.pOld.x, this.pOld.y);
      context.lineTo(this.p.x, this.p.y);
      context.stroke();
    } else if (agentShape == 'rect') {
      var s = 20 * agentSize;
      context.beginPath();
      context.rect(this.p.x - (s/2), this.p.y - (s/2), s, s);
      context.stroke();
    } else if (agentShape == 'arc') {
      // var m = map(this.p.y, 0, 800, 10, 1);
      var s = 10 * agentSize;
      context.beginPath();
      context.arc(this.p.x, this.p.y, s, 0, Math.PI*2, false);
      context.stroke();
    }

    this.pOld.x = this.p.x;
    this.pOld.y = this.p.y;

    this.isOutside = false;
  }
};
