var context, canvasW = 720, canvasH = 720, mouseX = 0, mouseY = 0;
function setUp() {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    context = canvas.getContext('2d');
    context.canvas.width = canvasW;
    context.canvas.height = canvasH;
}
function draw() {
    requestAnimationFrame(function () { draw(); });
    var h = (mouseY / 2) % 360;
    context.fillStyle = 'hsl(' + h + ', 100%, 50%)';
    context.fillRect(0, 0, canvasW, canvasH);
    context.fillStyle = 'hsl(' + (360 - h) + ', 100%, 50%)';
    var wh = (mouseX * 2) - canvasW;
    var xy = (canvasW / 2) - (wh / 2);
    context.fillRect(xy, xy, wh, wh);
}
document.onmousemove = function (e) {
    if (!e)
        e = window.event;
    mouseX = e.clientX;
    mouseY = e.clientY;
};
setUp();
draw();
