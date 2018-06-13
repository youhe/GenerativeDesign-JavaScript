var WIDTH = 200;
var PARTICLES = WIDTH * WIDTH;

// 基本セット
var container, camera, scene, renderer, geometry, controls;
var frame, particles;
frame = 0

// gpgpuをするために必要なオブジェクト達
var gpuCompute;
var velocityVariable;
var positionVariable;
var positionUniforms;
var velocityUniforms;
var particleUniforms;
var effectController;

init();
animate();

function init() {
  var wW = window.innerWidth;
  var wH = window.innerHeight;
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 75, wW / wH, 5, 15000 );
  camera.position.y = 120;
  camera.position.z = 200;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wW, wH);
  container.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  window.addEventListener('resize', onWindowResize, false);

  initComputeRenderer();
  initPosition();
}

function initComputeRenderer() {
  gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

  var dtPosition = gpuCompute.createTexture();
  var dtVelocity = gpuCompute.createTexture();

  fillTextures( dtPosition, dtVelocity );

  velocityVariable = gpuCompute.addVariable("textureVelocity", document.getElementById('computeShaderVelocity').textContent, dtVelocity);
  positionVariable = gpuCompute.addVariable("texturePosition", document.getElementById('computeShaderPosition').textContent, dtPosition);

  gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
  gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

  // error処理
  var error = gpuCompute.init();
  if ( error !== null ) {
      console.error( error );
  }
}

function initPosition() {
  geometry = new THREE.BufferGeometry();
  var positions = new Float32Array( PARTICLES * 3 );
  var p = 0;
  for ( var i = 0; i < PARTICLES; i++ ) {
    positions[ p++ ] = 0;
    positions[ p++ ] = 0;
    positions[ p++ ] = 0;
  }

  // uv情報の決定。テクスチャから情報を取り出すときに必要
  var uvs = new Float32Array( PARTICLES * 2 );
  p = 0;
  for ( var j = 0; j < WIDTH; j++ ) {
    for ( var i = 0; i < WIDTH; i++ ) {
      uvs[ p++ ] = i / ( WIDTH - 1 );
      uvs[ p++ ] = j / ( WIDTH - 1 );
    }
  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

  particleUniforms = {
    frame: {value: frame},
    texturePosition: { value: null },
    textureVelocity: { value: null },
    cameraConstant: { value: getCameraConstant( camera ) }
  };

  // Shaderマテリアル これはパーティクルそのものの描写に必要なシェーダー
  var material = new THREE.ShaderMaterial( {
    uniforms:       particleUniforms,
    vertexShader:   document.getElementById( 'particleVertexShader' ).textContent,
    fragmentShader: document.getElementById( 'particleFragmentShader' ).textContent
  });
  material.extensions.drawBuffers = true;
  particles = new THREE.Points( geometry, material );
  particles.matrixAutoUpdate = false;
  particles.updateMatrix();

  scene.add( particles );
}


function fillTextures( texturePosition, textureVelocity ) {
  var posArray = texturePosition.image.data;
  var velArray = textureVelocity.image.data;

  for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {
    // Position
    posArray[ k + 0 ] = 0;
    posArray[ k + 1 ] = 0;
    posArray[ k + 2 ] = 0;
    posArray[ k + 3 ] = random(-100, 100);

    velArray[ k + 0 ] = random(-10, 10);
    velArray[ k + 1 ] = random(-10, 10);
    velArray[ k + 2 ] = random(-10, 10);
    velArray[ k + 3 ] = random(-10, 10); // step
  }
}

function getCameraConstant( camera ) {
  return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  particleUniforms.cameraConstant.value = getCameraConstant( camera );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  // 計算用のテクスチャを更新
  gpuCompute.compute();

  frame++;

  particles.material.uniforms.frame.value = frame;
  particles.material.uniforms.needsUpdate = true;

　// 計算した結果が格納されたテクスチャをレンダリング用のシェーダーに渡す
  particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
  particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;
  renderer.render( scene, camera );
}