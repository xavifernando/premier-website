(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  // Professional plated-steel look: bright silver-blue zinc, readable on dark UI
  function makeMats() {
    return {
      plate: new THREE.MeshStandardMaterial({
        color: 0xb8cce0,
        metalness: 0.9,
        roughness: 0.22,
        emissive: 0x1a2838,
        emissiveIntensity: 0.12
      }),
      plateBright: new THREE.MeshStandardMaterial({
        color: 0xd8e6f2,
        metalness: 0.95,
        roughness: 0.12,
        emissive: 0x203040,
        emissiveIntensity: 0.15
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: 0xeef4fa,
        metalness: 0.98,
        roughness: 0.08,
        emissive: 0x152030,
        emissiveIntensity: 0.1
      }),
      dark: new THREE.MeshStandardMaterial({
        color: 0x243040,
        metalness: 0.7,
        roughness: 0.4
      }),
      accent: new THREE.MeshStandardMaterial({
        color: 0xe11d1d,
        metalness: 0.5,
        roughness: 0.35,
        emissive: 0x3a0808,
        emissiveIntensity: 0.2
      })
    };
  }

  function setupScene(canvas, camZ) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.35, camZ || 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.45;
    }

    scene.add(new THREE.AmbientLight(0x7088a0, 0.65));
    var key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3.5, 5, 4);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0x90b0d0, 0.5);
    fill.position.set(-3, 2, -2);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0x60a0e0, 0.4);
    rim.position.set(0, 1, -5);
    scene.add(rim);

    return { scene: scene, camera: camera, renderer: renderer };
  }

  function startLoop(group, renderer, scene, camera, canvas, speed) {
    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += speed || 0.01;
      group.rotation.y = t * 0.35;
      group.rotation.x = Math.sin(t * 0.4) * 0.15;
      renderer.render(scene, camera);
    }
    resize();
    animate();
    window.addEventListener('resize', resize);
  }

  function isMini(canvas) {
    return canvas.classList.contains('mini-canvas');
  }

  function createCaliper(canvas) {
    var cam = isMini(canvas) ? 7.5 : 5.8;
    var { scene, camera, renderer } = setupScene(canvas, cam);
    var mats = makeMats();
    var group = new THREE.Group();
    var s = isMini(canvas) ? 0.85 : 1;

    group.add(new THREE.Mesh(new THREE.BoxGeometry(2.2 * s, 1.1 * s, 0.9 * s), mats.plate));
    var bridge = new THREE.Mesh(new THREE.BoxGeometry(1.95 * s, 0.32 * s, 0.7 * s), mats.plateBright);
    bridge.position.y = 0.55 * s;
    group.add(bridge);

    var cylGeo = new THREE.CylinderGeometry(0.28 * s, 0.28 * s, 0.5 * s, 24);
    [-0.55, 0.55].forEach(function (x) {
      var c = new THREE.Mesh(cylGeo, mats.dark);
      c.rotation.x = Math.PI / 2;
      c.position.set(x * s, 0, 0.35 * s);
      group.add(c);
    });

    var earGeo = new THREE.BoxGeometry(0.35 * s, 0.5 * s, 0.4 * s);
    [-1.25, 1.25].forEach(function (x) {
      var e = new THREE.Mesh(earGeo, mats.plate);
      e.position.set(x * s, 0.25 * s, 0);
      group.add(e);
    });

    var stripe = new THREE.Mesh(new THREE.BoxGeometry(1.8 * s, 0.06 * s, 0.92 * s), mats.accent);
    stripe.position.y = -0.3 * s;
    group.add(stripe);

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.008);
  }

  function createCarrier(canvas) {
    var cam = isMini(canvas) ? 7.8 : 6.0;
    var { scene, camera, renderer } = setupScene(canvas, cam);
    var mats = makeMats();
    var group = new THREE.Group();
    var s = isMini(canvas) ? 0.85 : 1;

    var base = new THREE.Mesh(new THREE.BoxGeometry(2.5 * s, 0.22 * s, 1.35 * s), mats.plate);
    base.position.y = -0.4 * s;
    group.add(base);

    var upGeo = new THREE.BoxGeometry(0.35 * s, 1.35 * s, 0.48 * s);
    [-0.9, 0.9].forEach(function (x) {
      var u = new THREE.Mesh(upGeo, mats.plateBright);
      u.position.set(x * s, 0.28 * s, 0);
      group.add(u);
    });

    var cross = new THREE.Mesh(new THREE.BoxGeometry(2.0 * s, 0.28 * s, 0.4 * s), mats.plate);
    cross.position.y = 0.9 * s;
    group.add(cross);

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.007);
  }

  function createWrench(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 5.2);
    var mats = makeMats();
    var group = new THREE.Group();

    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.0, 16), mats.chrome);
    handle.rotation.z = Math.PI / 2;
    group.add(handle);

    var head = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.45, 6), mats.chrome);
    head.position.x = 1.05;
    group.add(head);

    var bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 12), mats.chrome);
    bar.position.x = 1.05;
    group.add(bar);

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.012);
  }

  function createFastener(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 4.8);
    var mats = makeMats();
    var group = new THREE.Group();

    var head = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 6), mats.plateBright);
    head.position.y = 0.65;
    group.add(head);

    var shank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 20), mats.plate);
    shank.position.y = -0.1;
    group.add(shank);

    for (var i = 0; i < 5; i++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.022, 8, 20), mats.dark);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.45 + i * 0.14;
      group.add(ring);
    }

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.014);
  }

  function createBracket(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 5.0);
    var mats = makeMats();
    var group = new THREE.Group();

    var vert = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.4, 1.0), mats.plate);
    vert.position.set(-0.4, 0.05, 0);
    group.add(vert);

    var horiz = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.0), mats.plateBright);
    horiz.position.set(0.2, -0.6, 0);
    group.add(horiz);

    var rib = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.12), mats.dark);
    rib.position.set(-0.05, -0.2, 0);
    group.add(rib);

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.01);
  }

  function createScrewRod(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 5.5);
    var mats = makeMats();
    var group = new THREE.Group();

    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 18), mats.plate);
    rod.rotation.z = Math.PI / 2;
    group.add(rod);

    for (var i = 0; i < 9; i++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 6, 16), mats.dark);
      ring.rotation.y = Math.PI / 2;
      ring.position.x = -0.95 + i * 0.22;
      group.add(ring);
    }

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.011);
  }

  function createDamper(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 4.8);
    var mats = makeMats();
    var group = new THREE.Group();

    var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.4, 32), mats.plate);
    disc.rotation.x = Math.PI / 2;
    group.add(disc);

    var boss = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 20), mats.dark);
    boss.rotation.x = Math.PI / 2;
    group.add(boss);

    [-0.85, 0.85].forEach(function (x) {
      var e = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.5), mats.plateBright);
      e.position.set(x, 0, 0);
      group.add(e);
    });

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.012);
  }

  function createFlangeBolt(canvas) {
    var { scene, camera, renderer } = setupScene(canvas, 4.8);
    var mats = makeMats();
    var group = new THREE.Group();

    var head = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 6), mats.plateBright);
    head.position.y = 0.78;
    group.add(head);

    var flange = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 24), mats.plate);
    flange.position.y = 0.62;
    group.add(flange);

    var shank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 18), mats.plate);
    shank.position.y = -0.05;
    group.add(shank);

    for (var i = 0; i < 5; i++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.02, 6, 16), mats.dark);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.4 + i * 0.13;
      group.add(ring);
    }

    scene.add(group);
    startLoop(group, renderer, scene, camera, canvas, 0.013);
  }

  var creators = {
    caliper: createCaliper,
    carrier: createCarrier,
    wrench: createWrench,
    fastener: createFastener,
    bracket: createBracket,
    screwrod: createScrewRod,
    damper: createDamper,
    flangebolt: createFlangeBolt
  };

  document.querySelectorAll('.product-canvas').forEach(function (canvas) {
    var type = canvas.getAttribute('data-product');
    if (creators[type]) creators[type](canvas);
  });
})();
