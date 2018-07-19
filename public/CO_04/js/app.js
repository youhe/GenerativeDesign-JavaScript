var width = 800,
  height = 800,
  canvas,
  context,
  mouseX = 0,
  mouseY = 0,
  frame = 0,
  drawMode = 0,
  size = 200,
  rects = [],
  missCnt = 0,
  colorH = fRandom(0, 360);


function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;

  context.fillStyle = '#000';
  context.globalAlpha = 1;
  context.fillRect(0, 0, width, height);

  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  for (var j = 0; j < 100; j++) {
    var x = fRandom(0, width / 10) * 10;
    var y = fRandom(0, height / 10) * 10;
    if (50000 / size < missCnt) {
      missCnt = 0;
      size = size / 4 * 3;
      colorH = (colorH + 10) % 360;
      console.log(size)
    }
    if (size < 5) missCnt = 0;

    var isDraw = true;
    for (var i = 0; i < rects.length; i++) {
      if (rects[i]['posX'] <= x + size && x <= rects[i]['posX'] + rects[i]['size']) {
        if (rects[i]['posY'] <= y + size && y <= rects[i]['posY'] + rects[i]['size']) {
          isDraw = false;
          missCnt++;
        }
      }
    }

    if (isDraw) {
      rects.push(
        {
          'posX': x,
          'posY': y,
          'size': size,
        }
      );

      var c1 = hsvToRgb('code', colorH, 60, 40);
      var c2 = hsvToRgb('code', colorH, 60, 100);

      context.fillStyle = c1;
      context.fillRect(x + 1, y + 1, size + (size / 30), size + (size / 30));
      context.fillStyle = c2;
      context.fillRect(x + 1, y + 1, size - 1, size - 1);
    }
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
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
