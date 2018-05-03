var N;
var width = 800,
    height = 800,
    canvas,
    context,
    nCanvas,
    nContext,
    mouseX,
    mouseY,
    frame = 0,
    noiseMode = 1;

var agents = [],
    agentsCount = 3000,
    noiseScale = 10,
    noiseStrength = 0.08,
    agentsAlpha = .02,
    strokeWidth = 0.3;

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

    mouseX = width;
    mouseY = height;

    for(var i=0; i<agentsCount; i++) {
      agents[i] = new Agent();
    }

    context.fillStyle = '#fff';
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    setnCanvas();
}

function draw() {
    requestAnimationFrame(function() { draw(); });

    frame++;
    if (frame%10 != 0) return;

    // context.globalAlpha = 0.1;
    // context.drawImage(nCanvas,
    //   0, 0, width/noiseScale, height/noiseScale,
    //   0, 0, width, height
    // );

    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#fff';
    context.globalAlpha = agentsAlpha;
    context.fillRect(0, 0, width, height);

    // context.globalCompositeOperation = 'lighter';
    context.strokeStyle = '#000';
    context.globalAlpha = .2;
    for(var i = 0; i < agentsCount; i++) {
        agents[i].update();
    }
}

function setnCanvas() {
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

function hsvToRgb(h, s, v) {
    h /= 360; s /= 100; v /= 100;
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function map(val, s1, e1, s2, e2) {
    return s2 + (e2 - s2) * ((val - s1) / (e1 - s1));
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

function lerp(a, b, c) {
    return ((b - a) * c) + a;
}

function constrain(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function clearDisplay() {
    context.fillStyle = '#000';
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
    if (key == 'c') clearDisplay();
    if (key == 't') toggleText();
    if (key == '1') {noiseMode = 1;setnCanvas()}
    if (key == '2') {noiseMode = 2;setnCanvas()}
});

document.onclick = function (e) {
    setnCanvas();
};

document.onmousemove = function (e) {
    if (!e) e = window.event;
    // mouseX = e.clientX;
    // mouseY = e.clientY;
};

window.addEventListener('load', setUp);
