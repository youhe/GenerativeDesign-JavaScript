var width = 800,
  height = 800,
  canvas,
  context,
  mouseX,
  mouseY,
  imgW = 800,
  imgH = 800,
  imgSrc = 'data/i3.jpg',
  imgData = [],
  frame = 0;

var agentId = '06',
  agentCnt = 300,
  agents = [],
  guiAgent;
var GuiAgent = function() {
  this.id = agentId;
}

function setUp() {
  canvas = document.createElement('canvas');
  canvas.id = 'js-canvas';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  context.canvas.width = width;
  context.canvas.height = height;

  mouseX = width / 2;
  mouseY = height / 2;

  // var gui = new dat.GUI();
  // guiAgent = new GuiAgent();
  // var guiId = ['00','01','02','03','04','05','06','07','08','09'];
  // gui.add(guiAgent, 'id', guiId).onChange(setVal);
  for(var i = 0; i < agentCnt; i++)
    agents[i] = new Agent();

  // setVal();
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
  frame++;

  // clearDisplay();

  context.strokeStyle = '#000';
  context.globalAlpha = .3;
  for(var i = 0; i < agentCnt; i++) {
    agents[i].draw(frame);
  }

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
});

document.onclick = function (e) {
};

document.onmousemove = function (e) {
  if (!e) e = window.event;
  mouseX = e.clientX;
  mouseY = e.clientY;
};

window.addEventListener('load', setUp);
