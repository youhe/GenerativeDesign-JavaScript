var frame = 0;

// オブジェクト
var points,
    pointsNum = 1000;

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

  // シーン
  var scene = new THREE.Scene();

  // カメラ
  var camera = new THREE.PerspectiveCamera(45, wW/wH, 1, 10000);
  camera.position.set(0, 0, 1000);
  // camera.lookAt({x:0, y:0, z:0 });

  var stargG = new THREE.Group();
  stargG.rotation.set(
    // Math.PI / 180 * 45,
    0,
    0,
    0,
  );
  stargG.position.set(0, 0, 0);
  scene.add(stargG);
  var starsGeometry = new THREE.Geometry();
  for ( var i = 0; i < pointsNum; i ++ ) {
  	var star = new THREE.Vector3();
  	star.x = 0;
  	star.y = 0;
  	star.z = 0;
    star.v = 0;
    star.vf = 0;
    star.r = 0;
    star.rf = 0;
    star.rv = 0;
    star.rvf = 0;
    star.fr = 0.9;
  	starsGeometry.vertices.push( star );
  }
  var starsMaterial = new THREE.ShaderMaterial({
    uniforms: {
  		f: {value: frame},
  	},
    vertexShader: `
    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : stegu
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //               https://github.com/stegu/webgl-noise
    //

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx);

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );
    }

    uniform float f;
    void main() {
      vec3 pos = position;
      float n = snoise(pos);
      pos.x = pos.x + 1.0;
      // pos.y;
      // pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );;
      gl_PointSize = 3.0;
    }
    `,
    fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `
  });
  var starField = new THREE.Points( starsGeometry, starsMaterial );
  stargG.add( starField );

  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  var cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  window.addEventListener('resize', resize);
  resize();
  draw();

  console.log(starField);

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

    starField.material.uniforms.f.value = frame;
    starField.material.uniforms.needsUpdate = true;

    // for ( var i = 0; i < pointsNum; i ++ ) {
    //   let x = starsGeometry.vertices[i].x;
    //   let y = starsGeometry.vertices[i].y;
    //   let z = starsGeometry.vertices[i].z;
    //   let v = starsGeometry.vertices[i].v;
    //   let vf = starsGeometry.vertices[i].vf;
    //   let r = starsGeometry.vertices[i].r;
    //   let rv = starsGeometry.vertices[i].rv;
    //   let rvf = starsGeometry.vertices[i].rvf;
    //   let fr = starsGeometry.vertices[i].fr;
    //
    //   vf += random(-0.07, 0.07);
    // 	vf *= 0.99;
    // 	v += vf;
    // 	v *= 0.9;
    // 	rvf += random(-0.001, 0.001);
    // 	rvf *= 0.97;
    // 	rv += rvf;
    // 	rv *= 0.9;
    // 	r += rv;
    // 	var vx = Math.cos(r) * v;
    //   var vz = Math.sin(r) * v;
    // 	var vy = random(0.1, 1);
    // 	x += vx;
    //   y += vy;
    // 	z += vz;
    //   if (300 < y) {
    //     x = 0;
    //     y = 0;
    //     z = 0;
    //   }
    //
    //   starsGeometry.vertices[i].x = x;
    //   starsGeometry.vertices[i].y = y;
    //   starsGeometry.vertices[i].z = z;
    //   starsGeometry.vertices[i].v = v;
    //   starsGeometry.vertices[i].vf = vf;
    //   starsGeometry.vertices[i].r = r;
    //   starsGeometry.vertices[i].rv = rv;
    //   starsGeometry.vertices[i].rvf = rvf;
    // }
    // starsGeometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
  }
}

window.addEventListener('load', init);
