var width = 800,
  height = 800,
  canvas,
  context,
  mouseX = 0,
  mouseY = 0,
  frame = 0,
  drawMode = 0,
  agentsCnt = 10,
  agents1 = [],
  agents2 = [];

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;

  for (var i = 0; i < agentsCnt; i++) {
    agents1[i] = new Agent('#9a1');
    agents2[i] = new Agent('#11b');
  }

  context.fillStyle = '#000';
  context.globalAlpha = 1;
  context.fillRect(0, 0, width, height);

  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  clearDisplay();

  var x = (Math.cos(frame * 0.021) * 300) + (width / 2);
  var y = (Math.sin(frame * 0.034) * 300) + (height / 2);

  context.strokeStyle = '#fff';
  context.fillStyle = '#fff';
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(x, y, 3, 0, Math.PI * 2, false);
  // context.fill();

  for (var i = 0; i < agentsCnt; i++) {
    agents1[i].draw(mouseX, mouseY);
    agents2[i].draw(mouseX, mouseY);
  }
}

function clearDisplay() {
  context.globalCompositeOperation = 'source-over';
  context.fillStyle = '#000';
  // context.globalAlpha = .02;
  context.globalAlpha = 0;
  context.fillRect(0, 0, width, height);
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
  if (key == 'c') clearDisplay();
  if (key == 'a') {
    clearDisplay();
    frame = 0;
    drawMode = (drawMode + 1) % 6;
  }
});

document.onclick = function (e) {
};

document.onmousemove = function (e) {
  if (!e) e = window.event;
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
