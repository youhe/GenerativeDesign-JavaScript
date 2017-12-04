var context:CanvasRenderingContext2D,
    canvasW:number = 800,
    canvasH:number = 800,
    mouseX:number = 0,
    mouseY:number = 0,
    radius:number = 360,
    angleStep:number = 36;

function setUp() {
  var canvas:HTMLCanvasElement = document.createElement('canvas');
  document.body.appendChild(canvas);

  context = canvas.getContext('2d');
  context.canvas.width = canvasW;
  context.canvas.height = canvasH;
}

function draw() {
  requestAnimationFrame(function() {draw()});

  context.fillStyle = 'rgb(180, 180, 180)';
  context.fillRect(0, 0, canvasW, canvasH);

  for (var angle = 0; angle <= 360; angle += angleStep) {
    context.fillStyle = 'hsl(' + angle + ', 100%, 50%)';

    context.beginPath();

    context.moveTo(canvasW / 2, canvasH / 2);

    var startAngle = angle * Math.PI / 180;
    context.lineTo(
      Math.cos(startAngle) * radius + (canvasW / 2),
      Math.sin(startAngle) * radius + (canvasH / 2)
    );

    var endAngle = (angle + angleStep) * Math.PI / 180;
    context.lineTo(
      Math.cos(endAngle) * radius + (canvasW / 2),
      Math.sin(endAngle) * radius + (canvasH / 2)
    );

    context.closePath();

    context.fill();
  }

}

document.onmousemove = function (e:Event) {
	if(!e) e = window.event;
  mouseX = (<any>e).clientX;
  mouseY = (<any>e).clientY;
  if (mouseX < canvasW / 2 && mouseY < canvasH / 2)
    angleStep = 36;
  else if (canvasW / 2 <= mouseX && mouseY < canvasH / 2)
    angleStep = 18;
  else if (mouseX < canvasW / 2 && canvasH / 2 <= mouseY)
    angleStep = 1;
  else
    angleStep = 9;
};

setUp();
draw();
