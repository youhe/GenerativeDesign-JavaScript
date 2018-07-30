var width = 800,
  height = 800,
  canvas,
  context,
  mouseX = 0,
  mouseY = 0,
  frame = 0,
  drawMode = 0,
  size = 100,
  rects = [],
  missCnt = 0,
  colorH = fRandom(0, 360),
  colorS = fRandom(0, 100),
  tile = 5;

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

  for (var i = 0; i < width / tile; i++) {
    context.fillStyle = '#666';
    context.fillRect(i * tile, 0, 1, height);
    context.fillRect(0, i * tile, width, 1);
  }

  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  for (var j = 0; j < 100; j++) {
    var x = fRandom(-size, (width) / tile) * tile;
    var y = fRandom(-size, (height) / tile) * tile;
    if (20000 / size < missCnt) {
      missCnt = 0;
      // size = size / 4 * 3;
      size = size - 5;
      colorS = (colorS + 10) % 100;
      console.log(size)
    }
    if (size <= 5) missCnt = 0;

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

      var c1 = hsvToRgb('code', colorS, 50, 40);
      // var c2 = hsvToRgb('code', colorS, 60, 100);
      var c2 = hsvToRgb('code', colorH, colorS, 100);

      context.fillStyle = '#fff';
      context.fillRect(x, y, size + 1, size + 1);
      context.fillStyle = c2;
      context.globalAlpha = .6;
      context.fillRect(x + 1, y + 1, size - 1, size - 1);

      // context.fillStyle = c1;
      // context.globalAlpha = .7;
      // context.fillRect(x, y, size + 1, size + 1);
      // context.fillStyle = c2;
      // context.globalAlpha = 1;
      // context.fillRect(x + (size / 4), y + (size / 4), size - (size / 2.1), size - (size / 2.1));
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
