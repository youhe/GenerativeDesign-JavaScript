var width = 800,
  height = 800,
  canvas,
  context,
  imgW = 800,
  imgH = 800,
  imgSrc = 'data/i8.jpg',
  imgData = [],
  frame = 0,
  drawMode = 0;

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  getImgData();
  clearDisplay();
}

function getImgData() {
  var img = new Image();
  img.onload = function () {
    var imgCanvas = document.createElement('canvas');
    var imgContext = imgCanvas.getContext('2d');
    imgContext.canvas.width = imgW;
    imgContext.canvas.height = imgH;
    imgContext.drawImage(img, 0, 0, imgW, imgH);
    var imgColor = imgContext.getImageData(0, 0, imgW, imgH);
    imgData = imgColor.data;
    draw();
  };
  img.src = imgSrc;
}

function draw() {
  requestAnimationFrame(function() { draw(); });

  for (var i = 0; i < 4000; i++) {
    var ix = random(0, width);
    var iy = random(0, height);
    var pixelIndex = Math.floor(ix) + (Math.floor(iy)*imgW);
    var r = imgData[pixelIndex*4+0];
    var g = imgData[pixelIndex*4+1];
    var b = imgData[pixelIndex*4+2];

    context.strokeStyle = 'rgb('+r+','+g+','+b+')';
    context.fillStyle = 'rgb('+r+','+g+','+b+')';
    context.lineWidth = 1;

    if (drawMode == 0) {
      var x = ix * 0.8 + (width * 0.1);
      var y = iy * 0.8 + (height * 0.1);
      context.fillRect(x, y, 1, 1);
    } else if (drawMode == 1) {
      var tx = map(ix, 0, width, -.2, .2);
      tx = Math.sin(tx) * 300;
      var x = ix;
      var y = iy + tx;
      x = x * 0.8 + (width * 0.1);
      y = y * 0.8 + (height * 0.1);
      context.fillRect(x, y, 1, 1);
    } else if (drawMode == 2) {
      var r = dist(0, 0, width / 2, height / 2) * (1 - iy / imgH) / 1.5;
      var t = Math.PI / 180 * ((ix / imgW) * 360 + 90);
      var x = ix;
      var y = (iy * map(ix, 0, width, 1, 0));
      x = x * 0.8 + (width * 0.1);
      y = y * 0.8 + (height * 0.1);
      context.fillRect(x, y, 1, 1);
    } else if (drawMode == 3) {
      var r = dist(0, 0, width / 2, height / 2) * (1 - iy / imgH) * 0.6;
      var t = Math.PI / 180 * ((ix / imgW) * 360 + 90);
      var x = Math.cos(t) * r + (width / 2);
      var y = Math.sin(t) * r + (height / 2);
      context.fillRect(x, y, 1, 1);
    } else if (drawMode == 4) {
      var md = dist(width / 2, height / 2, width, height);
      var d = dist(width / 2, height / 2, ix, iy);
      var m = map(d, 0, md, 1.0, .8);
      var x = (width / 2) + ((ix - (width / 2)) * m);
      var y = (height / 2) + ((iy - (height / 2)) * m);

      x = x * 0.9 + (width * 0.05);
      y = y * 0.9 + (height * 0.05);
      context.fillRect(x, y, 1, 1);
    } else if (drawMode == 5) {
      var md = dist(width / 2, height / 2, width, height);
      var d = dist(width / 2, height / 2, ix, iy);
      var m = map(d, 0, md, 120, -60);
      var p = rotate(m, ix, iy);
      p.x = p.x * 0.7 + (width * 0.15);
      p.y = p.y * 0.7 + (height * 0.15);
      context.fillRect(p.x, p.y, 1, 1);
    }
  };

  frame++;
}

function rotate(r, x, y) {
  var t = Math.PI / 180 * r;

  var cx = x - (width / 2);
  var cy = y - (height / 2);

  var tx = (cx * Math.cos(t)) - (cy * Math.sin(t));
  var ty = (cx * Math.sin(t)) + (cy * Math.cos(t));

  tx += (width / 2);
  ty += (height / 2);

  return {x: tx, y: ty};
}

function clearDisplay() {
  context.fillStyle = '#fff';
  context.globalAlpha = 1;
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
};

window.addEventListener('load', setUp);
