(function () {
  'use strict';
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 8;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var COUNT = 160;
  var positions = new Float32Array(COUNT * 3);
  var velocities = [];
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    velocities.push({ x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.006, z: (Math.random() - 0.5) * 0.004 });
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({ size: 0.06, color: 0x8ec5f0, transparent: true, opacity: 0.55, depthWrite: false });
  var points = new THREE.Points(geo, mat);
  scene.add(points);

  var aCount = 36;
  var aPos = new Float32Array(aCount * 3);
  var aVel = [];
  for (var j = 0; j < aCount; j++) {
    aPos[j * 3] = (Math.random() - 0.5) * 14;
    aPos[j * 3 + 1] = (Math.random() - 0.5) * 8;
    aPos[j * 3 + 2] = (Math.random() - 0.5) * 6;
    aVel.push({ x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.008, z: (Math.random() - 0.5) * 0.005 });
  }
  var aGeo = new THREE.BufferGeometry();
  aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  var aMat = new THREE.PointsMaterial({ size: 0.09, color: 0x2b7de9, transparent: true, opacity: 0.75, depthWrite: false });
  var aPoints = new THREE.Points(aGeo, aMat);
  scene.add(aPoints);

  function resize() {
    var parent = canvas.parentElement;
    var w = parent.clientWidth, h = parent.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate() {
    requestAnimationFrame(animate);
    var pos = geo.attributes.position.array;
    for (var i = 0; i < COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (Math.abs(pos[i * 3]) > 8) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 5) velocities[i].y *= -1;
    }
    geo.attributes.position.needsUpdate = true;
    var ap = aGeo.attributes.position.array;
    for (var k = 0; k < aCount; k++) {
      ap[k * 3] += aVel[k].x;
      ap[k * 3 + 1] += aVel[k].y;
      if (Math.abs(ap[k * 3]) > 7) aVel[k].x *= -1;
    }
    aGeo.attributes.position.needsUpdate = true;
    points.rotation.y += 0.0004;
    aPoints.rotation.y -= 0.0006;
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', resize);
  resize();
  animate();
})();
