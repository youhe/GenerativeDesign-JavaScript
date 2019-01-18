var width = 384,
    height = 512,
    canvas,
    context,
    mouseX,
    mouseY,
    frame = 0,
    imgCDJ;

// canvas
var canvasColor = '#000000',
    canvasAlpha = 1,
    canvasFrame = 0;

// noise
var N,
    noiseMode = '1',
    noiseOct = 6,
    noiseOfs = 3,
    // noisePer = 0.5,
    noisePer = 0.3,
    nCanvas,
    nContext,
    noiseScale = 1,
    noiseStrength = 0.04;

// Agent
var comps = [
  'source-over',
  'lighter',
  // 'destination-out',
  // 'xor',
  // 'multiply',
  'screen',
  // 'overlay',
  // 'darken',
  // 'lighten',
  // 'color-dodge',
  // 'color-burn',
  // 'soft-light',
  // 'difference',
  // 'exclusion',
  // 'hue',
  // 'saturation',
  // 'color',
];
var agents = [],
    agentShape = 'line',
    agentSize = 1,
    agentLineWidth = 0.5,
    agentCount = 3000,
    agentColorRandom = false,
    agentColor = '#e3b155',
    agentComp = comps[1],
    agentAlpha = 1,
    agentSpeed = 1;

// dat gui
var guiCanvas, guiNoise, guiAgent;
var GuiCanvas = function() {
  this.color = canvasColor;
  this.alpha = canvasAlpha;
  this.frame = canvasFrame;
}

var GuiNoise = function() {
  this.mode = noiseMode;
  this.octave = noiseOct;
  this.offset = noiseOfs;
  this.persistence = noisePer;
  this.change = setNCanvas;
  this.scale = noiseScale;
  this.strength = noiseStrength;
}

var GuiAgent = function() {
  this.shape = agentShape;
  this.size = agentSize,
  this.lineWidth = agentLineWidth,
  this.count = agentCount;
  this.colorRandom = agentColorRandom;
  this.color = agentColor;
  this.comp = agentComp;
  this.alpha = agentAlpha;
  this.speed = agentSpeed;
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

  nCanvas = document.createElement('canvas');
  document.body.appendChild(nCanvas);
  nContext = nCanvas.getContext('2d');
  nContext.canvas.width = width;
  nContext.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;

  for(var i=0; i<10000; i++) {
    agents[i] = new Agent();
  }

  var gui = new dat.GUI();

  guiCanvas = new GuiCanvas();
  var guiFcanvas = gui.addFolder('canvas');
  guiFcanvas.open();
  guiFcanvas.addColor(guiCanvas, 'color').onChange(setVal);
  guiFcanvas.add(guiCanvas, 'alpha', 0, 1).step(0.01).onChange(setVal);
  guiFcanvas.add(guiCanvas, 'frame', -10, 100).step(1).onChange(setVal);

  guiNoise = new GuiNoise();
  var guiFnoise = gui.addFolder('noise');
  guiFnoise.open();
  guiFnoise.add(guiNoise, 'mode', ['1', '2']).onChange(setVal);
  guiFnoise.add(guiNoise, 'octave', 1, 10).step(1).onChange(setVal);
  guiFnoise.add(guiNoise, 'offset', 2, 10).step(1).onChange(setVal);
  guiFnoise.add(guiNoise, 'persistence', 0, 1).step(0.1).onChange(setVal);
  guiFnoise.add(guiNoise, 'change');
  guiFnoise.add(guiNoise, 'scale', 1, 20).step(1).onChange(setVal);
  guiFnoise.add(guiNoise, 'strength', 0, 1).step(0.01).onChange(setVal);

  guiAgent = new GuiAgent();
  var guiFagent = gui.addFolder('agent');
  guiFagent.open();
  guiFagent.add(guiAgent, 'shape', ['line', 'rect', 'arc']).onChange(setVal);
  guiFagent.add(guiAgent, 'size', 1, 20).step(1).onChange(setVal);
  guiFagent.add(guiAgent, 'lineWidth', .1, 20).step(.1).onChange(setVal);
  guiFagent.add(guiAgent, 'count', 0, 10000).step(1).onChange(setVal);
  guiFagent.add(guiAgent, 'colorRandom').onChange(setVal);
  guiFagent.addColor(guiAgent, 'color').onChange(setVal);
  guiFagent.add(guiAgent, 'comp', comps).onChange(setVal);
  guiFagent.add(guiAgent, 'alpha', 0, 1).step(0.1).onChange(setVal);
  guiFagent.add(guiAgent, 'speed', 1, 10).step(1).onChange(setVal);

  setNCanvas();
  draw();
}

function setVal() {
  canvasColor = guiCanvas.color;
  canvasAlpha = guiCanvas.alpha;
  canvasFrame = guiCanvas.frame;

  noiseMode = guiNoise.mode;
  noiseOct = guiNoise.octave;
  noiseOfs = guiNoise.offset;
  noisePer = guiNoise.persistence;
  noiseScale = guiNoise.scale;
  noiseStrength = guiNoise.strength;

  agentShape = guiAgent.shape;
  agentSize = guiAgent.size;
  agentLineWidth = guiAgent.lineWidth;
  agentCount = guiAgent.count;
  agentColorRandom = guiAgent.colorRandom;
  agentColor = guiAgent.color;
  agentComp = guiAgent.comp;
  agentAlpha = guiAgent.alpha;
  agentSpeed = guiAgent.speed;
}

function draw() {
  requestAnimationFrame(function() { draw(); });

  frame++;
  if (frame%2 != 0) return;

  canvasAlpha = Math.max(canvasAlpha - 0.003, 0.01);

  // context.drawImage(nCanvas, 0, 0, width * noiseScale, height * noiseScale);

  context.globalCompositeOperation = 'source-over';
  context.fillStyle = canvasColor;
  context.globalAlpha = canvasAlpha;
  context.fillRect(0, 0, width, height);

  // context.globalCompositeOperation = 'source-over';
  // var grad  = context.createLinearGradient(0,0, 0,height);
  // grad.addColorStop(0,'#012676');
  // grad.addColorStop(.3,'#012676');
  // grad.addColorStop(1,'#39A0F9');
  // context.fillStyle = grad;
  // context.globalAlpha = canvasAlpha;
  // context.fillRect(0, 0, width, height);

  context.globalAlpha = 0.01;
  context.drawImage(imgCDJ, 0, 0);

  context.globalCompositeOperation = agentComp;
  context.strokeStyle = agentColor;
  context.globalAlpha = agentAlpha;
  for(var i = 0; i < agentCount; i++) {
    agents[i].update();
  }
}

function setNCanvas() {
  N = new noiseX(
    noiseOct,
    noiseOfs,
    noisePer
  );
  var s = Math.floor(Math.random() * 1000);
  N.setSeed(s);

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var nV
      if (noiseMode == 1) {
        nV = N.noise(x, y) * 255;
        nV = Math.floor(nV);
      }
      if (noiseMode == 2) {
        var n = N.noise(x, y) * 24;
        nV = (n - Math.floor(n)) * 255;
        nV = Math.floor(nV);
      }
      nContext.fillStyle = 'rgb('+nV+','+nV+','+nV+')';
      nContext.fillRect(x, y, 1, 1);
    }
  }
  imgCDJ = new Image();
  imgCDJ.onload = function () {
    nContext.drawImage(imgCDJ, 0, 0);
  }
  imgCDJ.src = './cdj.png'
  // nContext.fillStyle = '#fff';
  // nContext.font = "100px 'ＭＳ ゴシック'";
  // nContext.textAlign = 'center';
  // nContext.fillText('CDJ', width / 2, height / 2 + 30);
}

document.addEventListener('mousedown', (event) => {
});

document.addEventListener('mouseup', (event) => {
});

document.onmousemove = function (e) {
  if (!e) e = window.event;
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
