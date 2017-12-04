var context:CanvasRenderingContext2D,
    canvasW:number = 800,
    canvasH:number = 800,
    mouseX:number = 0,
    mouseY:number = 0;

function setUp() {
  var canvas:HTMLCanvasElement = document.createElement('canvas');
  document.body.appendChild(canvas);

  context = canvas.getContext('2d');
  context.canvas.width = canvasW;
  context.canvas.height = canvasH;
}

function draw() {
  requestAnimationFrame(function() {draw()});

  var h = (mouseY / 2) % 360;

  context.fillStyle = 'hsl(' + h + ', 100%, 50%)';
  context.fillRect(0, 0, canvasW, canvasH);

  context.fillStyle = 'hsl(' + (360 - h) + ', 100%, 50%)';
  var wh = (mouseX * 2) - canvasW;
  var xy = (canvasW / 2) - (wh / 2);
  context.fillRect(xy, xy, wh, wh);
}

document.onmousemove = function (e:Event) {
	if(!e) e = window.event;
  mouseX = (<any>e).clientX;
  mouseY = (<any>e).clientY;
};

setUp();
draw();
