class Agent {
  constructor() {
    this.f = Math.abs(random(0, 1000));
    this.r = random(width*0.1, width*0.5);
    this.r = random(width*0.1, dist(0, 0, width*0.5, height*0.5));
    // this.r = random(width*0.1, width*0.5);
    this.rX = random(0, 1);
    this.rY = random(0, 1);

    this.x = 0;
    this.y = 0;
    this.oldX = this.x;
    this.oldY = this.y;
  }

  draw(f) {
    f = f + this.f;
    var r = this.r * Math.cos(f * 0.01 * this.rX);
    this.x = Math.cos(f * 0.03) * r;
    this.y = Math.sin(f * 0.03) * r;

    this.x += width / 2;
    this.y += height / 2;

    if (this.oldX != 0) {
      var pixelIndex = Math.floor(this.x) + (Math.floor(this.y)*imgW);
      var r = imgData[pixelIndex*4+0];
      var g = imgData[pixelIndex*4+1];
      var b = imgData[pixelIndex*4+2];

      context.beginPath();
      context.strokeStyle = 'rgb('+r+','+g+','+b+')';
      context.lineWidth = 1;
      // context.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
      context.moveTo(this.oldX, this.oldY);
      context.lineTo(this.x, this.y);
      context.stroke();
    }


    this.oldX = this.x;
    this.oldY = this.y;
  }
}
