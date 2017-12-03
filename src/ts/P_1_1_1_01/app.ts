var context:CanvasRenderingContext2D,
    canvasW:number = 800,
    canvasH:number = 400,
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

  // var h = (mouseY / 2) % 360;
  var stepX = mouseX + 2;
  var stepY = mouseY + 2;
  for (var gridY = 0; gridY < canvasH; gridY += stepY) {
    for (var gridX = 0; gridX < canvasW; gridX += stepX) {
      var h = gridX / canvasW * 360;
      var s = (canvasH - gridY) / canvasH * 100;
      var l = 100 - ((canvasH - gridY) / canvasH * 50);
      context.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
      context.fillRect(gridX, gridY, stepX, stepY);
    }
  }
}

document.onmousemove = function (e:Event) {
	if(!e) e = window.event;
  mouseX = (<any>e).clientX;
  mouseY = (<any>e).clientY;
};

setUp();
draw();
