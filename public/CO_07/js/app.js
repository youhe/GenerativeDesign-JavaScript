var frame = 0,
    cameraR = 1;

function setUp() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.y = .4;
  camera.position.z = cameraR;

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var helper = new THREE.PolarGridHelper(.6, .6, 8, 64);
  helper.position.y = -.6;
  scene.add(helper);

  draw();
}

function draw() {
  requestAnimationFrame(function() { draw(); });

  frame++;

  camera.position.x = Math.cos(frame * 0.01) * cameraR;
  camera.position.z = Math.sin(frame * 0.01) * cameraR;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
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
