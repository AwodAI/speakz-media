function initThreeHero() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Icosahedron wireframe
  const icoGeo  = new THREE.IcosahedronGeometry(1.5, 1);
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x00F5D4, transparent: true, opacity: 0.85 });
  const ico = new THREE.LineSegments(wireGeo, wireMat);
  scene.add(ico);

  // Glow point light
  const light = new THREE.PointLight(0x00F5D4, 2, 3);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x7B2FBE, 0.5);
  scene.add(ambient);

  // ── Particles ────────────────────────────────────
  const PARTICLE_COUNT = 300;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3]     = 0;
    pPositions[i * 3 + 1] = 0;
    pPositions[i * 3 + 2] = 0;
    velocities.push({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 16
    });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x00F5D4, size: 0.05, transparent: true, opacity: 0 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── State ────────────────────────────────────────
  let exploded = false;
  let explodeProgress = 0; // 0 → 1
  const originalPositions = new Float32Array(pPositions);

  window._heroExplode = function(progress) {
    if (!exploded && progress > 0.01) exploded = true;
    explodeProgress = progress;
    pMat.opacity = Math.min(1, progress * 3);

    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = velocities[i];
      const t = Math.min(progress * 1.2, 1);
      pos[i * 3]     = v.x * t;
      pos[i * 3 + 1] = v.y * t;
      pos[i * 3 + 2] = v.z * t;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Fade out icosahedron
    wireMat.opacity = Math.max(0, 0.85 - progress * 2);
    // Camera FOV
    camera.fov = 60 + progress * 60;
    camera.updateProjectionMatrix();
  };

  // ── Resize ───────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // ── Animate ──────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    if (!exploded) {
      ico.rotation.y += 0.003;
      ico.rotation.x += 0.001;
    }
    renderer.render(scene, camera);
  }
  animate();
}

// Grain canvas
function initGrain() {
  const canvas = document.getElementById('hero-grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  setInterval(drawGrain, 80);
  drawGrain();
}
