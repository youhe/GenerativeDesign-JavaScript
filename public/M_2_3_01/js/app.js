var width = 800,
    height = 800,
    canvas,
    context,
    mouseX,
    mouseY,
    frame = 0;

// canvas
var canvasColor = '#000',
    canvasAlpha = 0.009;

// Agent
var agents = [],
    agentsCnt = 3;

// dat gui
var guiCanvas, guiNoise, guiAgent;
var GuiCanvas = function() {
  this.color = canvasColor;
  this.alpha = canvasAlpha;
  this.frame = canvasFrame;
}

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;
  context.fillStyle = canvasColor;
  context.globalAlpha = 1;
  context.fillRect(0, 0, width, height);

  for (var i = 0; i < agentsCnt; i++) {
    agents[i] = new Agent(i);
  }

  var gui = new dat.GUI();
  // guiCanvas = new GuiCanvas();
  // var guiFcanvas = gui.addFolder('canvas');
  // guiFcanvas.open();
  // guiFcanvas.addColor(guiCanvas, 'color').onChange(setVal);
  // guiFcanvas.add(guiCanvas, 'alpha', 0, 1).step(0.01).onChange(setVal);
  // guiFcanvas.add(guiCanvas, 'frame', -10, 100).step(1).onChange(setVal);

  draw();
  draw();
  draw();
}

function setVal() {
  canvasColor = guiCanvas.color;
  canvasAlpha = guiCanvas.alpha;
  canvasFrame = guiCanvas.frame;
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  // context.globalCompositeOperation = 'source-over';
  // context.fillStyle = canvasColor;
  // context.globalAlpha = canvasAlpha;
  // context.fillRect(0, 0, width, height);

  for (var i = 0; i < agentsCnt; i++) {
    agents[i].draw(frame);
  }
}

document.addEventListener('mousedown', (event) => {});

document.addEventListener('mouseup', (event) => {});

document.onmousemove = function (e) {
  if (!e) e = window.event;
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
