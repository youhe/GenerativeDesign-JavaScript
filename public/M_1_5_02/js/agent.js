class Agent {
  constructor() {
    this.p = {
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 800)
    };
    this.pOld = {x: this.p.x, y: this.p.y};
    this.stepSize = Math.floor(Math.random() * 6) + 2;
    this.angle;
    this.isOutside = false;
  }

  update1() {
    var data = nContext.getImageData(this.p.x/noiseScale, this.p.y/noiseScale, 1, 1).data;
    this.angle = data[0];
    this.angle *= noiseStrength;

    this.p.x += Math.cos(this.angle) * this.stepSize;
    this.p.y += Math.sin(this.angle) * this.stepSize;

    if(this.p.x < -10) this.isOutside = true;
    else if(this.p.x > width + 10) this.isOutside = true;
    else if(this.p.y < -10) this.isOutside = true;
    else if(this.p.y > height + 10) this.isOutside = true;

    if (this.isOutside) {
      this.p.x = Math.floor(Math.random() * width);
      this.p.y = Math.floor(Math.random() * height);
      this.pOld.x = this.p.x;
      this.pOld.y = this.p.y;
    }

    context.lineWidth = .3 * this.stepSize;
    context.beginPath();
    context.moveTo(this.pOld.x, this.pOld.y);
    context.lineTo(this.p.x, this.p.y);
    context.stroke();

    this.pOld.x = this.p.x;
    this.pOld.y = this.p.y;

    this.isOutside = false;
  }

  // void update2(){
  //   angle = noise(p.x/noiseScale,p.y/noiseScale) * 24;
  //   angle = (angle - int(angle)) * noiseStrength;
  //
  //   p.x += cos(angle) * stepSize;
  //   p.y += sin(angle) * stepSize;
  //
  //   if(p.x<-10) isOutside = true;
  //   else if(p.x>width+10) isOutside = true;
  //   else if(p.y<-10) isOutside = true;
  //   else if(p.y>height+10) isOutside = true;
  //
  //   if (isOutside) {
  //     p.x = random(width);
  //     p.y = random(height);
  //     pOld.set(p);
  //   }
  //
  //   strokeWeight(strokeWidth*stepSize);
  //   line(pOld.x,pOld.y, p.x,p.y);
  //
  //   pOld.set(p);
  //
  //   isOutside = false;
  // }
};
