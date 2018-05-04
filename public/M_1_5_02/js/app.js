var width = 800,
    height = 800,
    canvas,
    context,
    mouseX,
    mouseY,
    frame = 0;

// canvas
var canvasColor = '#002503',
    canvasAlpha = 0.05;

// noise
var N,
    nCanvas,
    nContext,
    noiseMode = 1;
    noiseScale = 10,
    noiseStrength = 0.06;

// Agent
var agents = [],
    agentsCount = 3000,
    agentsColor = '#412',
    agentComp = 'lighter',
    agentsAlpha = .3,
    strokeWidth = 0.7;

// dat gui
var guiCanvas, guiNoise, guiAgent;
var GuiCanvas = function() {
  this.color = canvasColor;
  this.alpha = canvasAlpha;
}

var GuiNoise = function() {
  this.mode = noiseMode;
  this.scale = noiseScale;
  this.strength = noiseStrength;
}

var GuiAgent = function() {
  this.count = agentsCount;
  this.color = agentsColor;
  this.comp = agentComp;
  this.alpha = agentsAlpha;
  this.width = strokeWidth;
}

function setUp() {
    canvas = document.createElement('canvas');
    canvas.id = 'js-canvas';
    document.body.appendChild(canvas);
    context = canvas.getContext('2d');
    context.canvas.width = width;
    context.canvas.height = height;

    nCanvas = document.createElement('canvas');
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

    guiNoise = new GuiNoise();
    var guiFnoise = gui.addFolder('noise');
    guiFnoise.open();
    guiFnoise.add(guiNoise, 'mode', 0, 1).step(1).onChange(setVal);
    guiFnoise.add(guiNoise, 'scale', 1, 20).step(1).onChange(setVal);
    guiFnoise.add(guiNoise, 'strength', 0, 1).step(0.01).onChange(setVal);

    guiAgent = new GuiAgent();
    var guiFagent = gui.addFolder('agent');
    guiFagent.open();
    guiFagent.add(guiAgent, 'count', 0, 10000).step(1).onChange(setVal);
    guiFagent.addColor(guiAgent, 'color').onChange(setVal);

    guiFagent.add(guiAgent, 'comp', ['lighter', 'source-over']).onChange(setVal);
    guiFagent.add(guiAgent, 'alpha', 0, 1).step(0.1).onChange(setVal);
    guiFagent.add(guiAgent, 'width', 0.1, 100).step(0.1).onChange(setVal);

    clearDisplay();
    toggleText();
    setNCanvas();
}

function setVal() {
  canvasColor = guiCanvas.color;
  canvasAlpha = guiCanvas.alpha;

  noiseMode = guiNoise.mode;
  noiseScale = guiNoise.scale;
  noiseStrength = guiNoise.strength;

  agentsCount = guiAgent.count;
  agentsColor = guiAgent.color;
  agentComp = guiAgent.comp;
  agentsAlpha = guiAgent.alpha;
  strokeWidth = guiAgent.width;
}

function draw() {
    requestAnimationFrame(function() { draw(); });

    frame++;
    if (frame%3 != 0) return;

    context.globalCompositeOperation = 'source-over';
    context.fillStyle = canvasColor;
    context.globalAlpha = canvasAlpha;
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = agentComp;
    context.strokeStyle = agentsColor;
    context.globalAlpha = agentsAlpha;
    for(var i = 0; i < agentsCount; i++) {
        agents[i].update();
    }
}

function clearDisplay() {
    context.fillStyle = '#000';
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);
}

function setNCanvas() {
    N = new noiseX(
      4,
      2,
      0.5
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
    if (frame == 0) draw();
}

function toggleText() {
    var textBox = document.getElementById('textBox');
    var display = textBox.style.display;
    if (display == 'none') textBox.style.display = 'block';
    else textBox.style.display = 'none';
}

document.addEventListener('mousedown', (event) => {
});

document.addEventListener('mouseup', (event) => {
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key == 'c') clearDisplay();
    if (key == 't') toggleText();
    if (key == '1') {noiseMode = 1;setNCanvas()}
    if (key == '2') {noiseMode = 2;setNCanvas()}
});

document.onclick = function (e) {
    // setNCanvas();
};

document.onmousemove = function (e) {
    if (!e) e = window.event;
    // mouseX = e.clientX;
    // mouseY = e.clientY;
};

window.addEventListener('load', setUp);
