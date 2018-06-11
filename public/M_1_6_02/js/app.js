var frame = 0;

// オブジェクト
var P_WIDTH = 200,
    P_NUM = P_WIDTH * P_WIDTH;

function init() {
  // レンダラー
  let wW = window.innerWidth;
  let wH = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wW, wH);
  renderer.setClearColor(0x000000, 1);
  renderer.domElement.id = 'js-canvas';
  document.body.appendChild(renderer.domElement);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, wW/wH, 1, 10000);
  camera.position.set(0, 0, 1000);

  var gpuCompute;
  var velocityVariable;
  var positionVariable;
  var positionUniforms;
  var velocityUniforms;
  var particleUniforms;
  var effectController;


  gpuCompute = new GPUComputationRenderer( P_WIDTH, P_WIDTH, renderer );
  // 今回はパーティクルの位置情報と、移動方向を保存するテクスチャを2つ用意します
  var dtPosition = gpuCompute.createTexture();
  var dtVelocity = gpuCompute.createTexture();
  // テクスチャにGPUで計算するために初期情報を埋めていく
  fillTextures( dtPosition, dtVelocity );
  // shaderプログラムのアタッチ
  velocityVariable = gpuCompute.addVariable(
    "textureVelocity",
    `
    #include <common>

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      float idParticle = uv.y * resolution.x + uv.x;
      vec4 tmpVel = texture2D( textureVelocity, uv );
      vec3 vel = tmpVel.xyz;

      gl_FragColor = vec4( vel.xyz, 1.0 );
    }
    `, `
    #include <common>
     uniform sampler2D texturePosition;
     uniform float cameraConstant;
     uniform float density;
     varying vec4 vColor;
     varying vec2 vUv;
     uniform float radius;

     void main() {
       vec4 posTemp = texture2D( texturePosition, uv );
       vec3 pos = posTemp.xyz;
       vColor = vec4( 1.0, 0.7, 1.0, 1.0 );

       // ポイントのサイズを決定
       vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
       gl_PointSize = 0.5 * cameraConstant / ( - mvPosition.z );

       // uv情報の引き渡し
       vUv = uv;

       // 変換して格納
       gl_Position = projectionMatrix * mvPosition;
     }
    `,
    dtVelocity
  );
  positionVariable = gpuCompute.addVariable(
    "texturePosition",
    `
    #define delta ( 1.0 / 60.0 )
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 tmpPos = texture2D( texturePosition, uv );
      vec3 pos = tmpPos.xyz;
      vec4 tmpVel = texture2D( textureVelocity, uv );
      // velが移動する方向(もう一つ下のcomputeShaderVelocityを参照)
      vec3 vel = tmpVel.xyz;

      // 移動する方向に速度を掛け合わせた数値を現在地に加える。
      pos += vel * delta;
      gl_FragColor = vec4( pos, 1.0 );
    }
    `,
    dtPosition
  );
  // 一連の関係性を構築するためのおまじない
  gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
  gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );


  geometry = new THREE.BufferGeometry();
  var positions = new Float32Array( P_NUM * 3 );
  var p = 0;
  for ( var i = 0; i < P_NUM; i++ ) {
     positions[ p++ ] = 0;
     positions[ p++ ] = 0;
     positions[ p++ ] = 0;
  }

  // uv情報の決定。テクスチャから情報を取り出すときに必要
  var uvs = new Float32Array( P_NUM * 2 );
  p = 0;
  for ( var j = 0; j < P_WIDTH; j++ ) {
     for ( var i = 0; i < P_WIDTH; i++ ) {
         uvs[ p++ ] = i / ( P_WIDTH - 1 );
         uvs[ p++ ] = j / ( P_WIDTH - 1 );
     }
  }

  // attributeをgeometryに登録する
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );


  // uniform変数をオブジェクトで定義
  // 今回はカメラをマウスでいじれるように、計算に必要な情報もわたす。
  particleUniforms = {
     texturePosition: { value: null },
     textureVelocity: { value: null },
     cameraConstant: { value: getCameraConstant( camera ) }
  };

  var material = new THREE.ShaderMaterial( {
    uniforms:       particleUniforms,
    vertexShader: `
      #include <common>
      uniform sampler2D texturePosition;
      uniform float cameraConstant;
      uniform float density;
      varying vec4 vColor;
      varying vec2 vUv;
      uniform float radius;



      void main() {
          vec4 posTemp = texture2D( texturePosition, uv );
          vec3 pos = posTemp.xyz;
          vColor = vec4( 1.0, 0.7, 1.0, 1.0 );

          // ポイントのサイズを決定
          vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
          gl_PointSize = 0.5 * cameraConstant / ( - mvPosition.z );

          // uv情報の引き渡し
          vUv = uv;

          // 変換して格納
          gl_Position = projectionMatrix * mvPosition;
      }
     `,
     fragmentShader: `
     // VertexShaderから受け取った色を格納するだけ。
     varying vec4 vColor;
     void main() {
       // 丸い形に色をぬるための計算
       float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
       if ( f > 0.1 ) {
         discard;
       }
       gl_FragColor = vColor;
     }
     `
  });
  material.extensions.drawBuffers = true;
  var particles = new THREE.Points( geometry, material );
  particles.matrixAutoUpdate = false;
  particles.updateMatrix();

  // パーティクルをシーンに追加
  scene.add( particles );

  function fillTextures( texturePosition, textureVelocity ) {
    // textureのイメージデータをいったん取り出す
    var posArray = texturePosition.image.data;
    var velArray = textureVelocity.image.data;

    // パーティクルの初期の位置は、ランダムなXZに平面おく。
    // 板状の正方形が描かれる
    for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {
      // Position
      var x, y, z;
      x = Math.random()*500-250;
      z = Math.random()*500-250;
      y = 0;
      // posArrayの実態は一次元配列なので
      // x,y,z,wの順番に埋めていく。
      // wは今回は使用しないが、配列の順番などを埋めておくといろいろ使えて便利
      posArray[ k + 0 ] = x;
      posArray[ k + 1 ] = y;
      posArray[ k + 2 ] = z;
      posArray[ k + 3 ] = 0;

      // 移動する方向はとりあえずランダムに決めてみる。
      // これでランダムな方向にとぶパーティクルが出来上がるはず。
      velArray[ k + 0 ] = Math.random()*2-1;
      velArray[ k + 1 ] = Math.random()*2-1;
      velArray[ k + 2 ] = Math.random()*2-1;
      velArray[ k + 3 ] = Math.random()*2-1;
    }
  }

  function getCameraConstant( camera ) {
    return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  function resize() {
    wW = window.innerWidth;
    wH = window.innerHeight;
    camera.aspect = wW / wH;
    camera.updateProjectionMatrix();
    renderer.setSize(wW, wH);
  }

  function draw() {
    requestAnimationFrame(draw);
    frame++;

    // starField.material.uniforms.f.value = frame;
    // starField.material.uniforms.needsUpdate = true;

    renderer.render(scene, camera);
  }
}

window.addEventListener('load', init);
