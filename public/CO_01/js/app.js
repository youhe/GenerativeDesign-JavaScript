var width = 800,
  height = 800,
  canvas,
  context,
  mouseX,
  mouseY,
  frame = 0;

var agentId = '06',
  agentCnt = 1,
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

  var gui = new dat.GUI();
  guiAgent = new GuiAgent();
  var guiId = ['00','01','02','03','04','05','06','07','08','09'];
  gui.add(guiAgent, 'id', guiId).onChange(setVal);

  setVal();
  clearDisplay();
  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });
  frame++;

  if (frame % 3 != 0) return; 
  // clearDisplay();

  context.strokeStyle = '#000';
  context.globalAlpha = .2;
  for(var i = 0; i < agentCnt; i++) {
    // agents[i].draw();
  }

}

function setVal() {
  switch (guiAgent.id) {
    case '00': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent00();
      break;
    }
    case '01': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent01();
      break;
    }
    case '02': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent02();
      break;
    }
    case '03': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent03();
      break;
    }
    case '04': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent04();
      break;
    }
    case '05': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent05();
      break;
    }
    case '06': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent06();
      break;
    }
    case '07': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent07();
      break;
    }
    case '08': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent08();
      break;
    }
    case '09': {
      for(var i = 0; i < agentCnt; i++) agents[i] = new Agent09();
      break;
    }
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
