var width = 800,
  height = 800,
  canvas,
  context,
  oldX = 0,
  oldY = 0,
  mouseX = 0,
  mouseY = 0,
  frame = 0,
  drawMode = 0;

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;
  oldX = mouseX;
  oldY = mouseY;

  context.fillStyle = '#000';
  context.globalAlpha = 1;
  context.fillRect(0, 0, width, height);

  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  mouseX = Math.cos(frame * 0.01) * 200 + Math.cos(frame * 0.013 + 50) * 100 + (width / 2);
  mouseY = Math.sin(frame * 0.01) * 200 + Math.sin(frame * 0.013 + 50) * 100 + (height / 2);

  if (frame % 1 == 0) {
    context.strokeStyle = '#fff';
    context.globalAlpha = 0.1;
    context.lineWidth = dist(oldX, oldY, mouseX, mouseY) / 10;
    context.beginPath();
    context.moveTo(oldX, oldY);
    context.lineTo(mouseX, mouseY);
    context.stroke();

    oldX = (mouseX - oldX) * 0.01 + oldX;
    oldY = (mouseY - oldY) * 0.01 + oldY;
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
  // mouseX = e.clientX;
  // mouseY = e.clientY;
};

window.addEventListener('load', setUp);
