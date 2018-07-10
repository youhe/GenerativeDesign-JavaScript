var width = 800,
  height = 800,
  canvas,
  context,
  mouseX,
  mouseY,
  frame = 0;

var agentId = '08',
  agentColor = 'black',
  agentCnt = 20,
  agents = [],
  guiAgent;

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;

  context.fillStyle = '#fff';
  context.globalAlpha = 1;
  context.fillRect(0, 0, width, height);
  for(var i = 0; i < agentCnt; i++) agents[i] = new Agent08();
  toggleText();
  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  if (frame % 2 != 0) return;

  // if (agentColor == 'white') context.fillStyle = '#000';
  // else context.fillStyle = '#fff';
  // context.globalAlpha = .08;
  // context.fillRect(0, 0, width, height);

  if (agentColor == 'white') context.strokeStyle = '#fff';
  else context.strokeStyle = '#060';
  context.globalAlpha = .7;
  for(var i = 0; i < agentCnt; i++) {
    agents[i].draw();
  }

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
  if (key == 't') toggleText();
});

document.onclick = function (e) {
};

document.onmousemove = function (e) {
  if (!e) e = window.event;
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
