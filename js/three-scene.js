(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle system — metallic ions floating
  const COUNT = 180;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.006,
      z: (Math.random() - 0.5) * 0.004
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xc9d4de,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Accent teal particles
  const accentCount = 40;
  const accentPos = new Float32Array(accentCount * 3);
  const accentVel = [];
  for (let i = 0; i < accentCount; i++) {
    accentPos[i * 3] = (Math.random() - 0.5) * 14;
    accentPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    accentPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    accentVel.push({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.005
    });
  }
  const accentGeo = new THREE.BufferGeometry();
  accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
  const accentMat = new THREE.PointsMaterial({
    size: 0.09,
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false
  });
  const accentPoints = new THREE.Points(accentGeo, accentMat);
  scene.add(accentPoints);

  // Warm amber particles
  const warmCount = 24;
  const warmPos = new Float32Array(warmCount * 3);
  const warmVel = [];
  for (let i = 0; i < warmCount; i++) {
    warmPos[i * 3] = (Math.random() - 0.5) * 13;
    warmPos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    warmPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    warmVel.push({
      x: (Math.random() - 0.5) * 0.011,
      y: (Math.random() - 0.5) * 0.009,
      z: (Math.random() - 0.5) * 0.005
    });
  }
  const warmGeo = new THREE.BufferGeometry();
  warmGeo.setAttribute('position', new THREE.BufferAttribute(warmPos, 3));
  const warmMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false
  });
  const warmPoints = new THREE.Points(warmGeo, warmMat);
  scene.add(warmPoints);

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate() {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (Math.abs(pos[i * 3]) > 8) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 5) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 4) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    const aPos = accentGeo.attributes.position.array;
    for (let i = 0; i < accentCount; i++) {
      aPos[i * 3] += accentVel[i].x;
      aPos[i * 3 + 1] += accentVel[i].y;
      aPos[i * 3 + 2] += accentVel[i].z;
      if (Math.abs(aPos[i * 3]) > 7) accentVel[i].x *= -1;
      if (Math.abs(aPos[i * 3 + 1]) > 4) accentVel[i].y *= -1;
    }
    accentGeo.attributes.position.needsUpdate = true;

    const wPos = warmGeo.attributes.position.array;
    for (let i = 0; i < warmCount; i++) {
      wPos[i * 3] += warmVel[i].x;
      wPos[i * 3 + 1] += warmVel[i].y;
      wPos[i * 3 + 2] += warmVel[i].z;
      if (Math.abs(wPos[i * 3]) > 6.5) warmVel[i].x *= -1;
      if (Math.abs(wPos[i * 3 + 1]) > 3.5) warmVel[i].y *= -1;
    }
    warmGeo.attributes.position.needsUpdate = true;

    points.rotation.y += 0.0004;
    accentPoints.rotation.y -= 0.0006;
    warmPoints.rotation.y += 0.0008;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();
