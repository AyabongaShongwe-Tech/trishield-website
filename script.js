/* ============================================================
   TRISHIELD ANALYTICS & SECURITY — script.js
   All JavaScript: Intro animation, Three.js 3D scenes,
   cursor, modals, forms, counters, scroll effects
   ============================================================ */

'use strict';

/* ============================================================
   LOGO (Base64 embedded — replace src="" with actual path
   when deploying with a real logo file)
   ============================================================ */
const LOGO_SRC = ""; // Replace with your actual logo path e.g. "assets/logo.png"
// If no logo file, the shield SVG in the intro will serve as the brand mark
function injectLogos() {
  const els = ['navLogoImg','missionLogoImg','footerLogoImg'];
  els.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (LOGO_SRC) {
      el.src = LOGO_SRC;
    } else {
      // Fallback: hide img and show text logo
      el.style.display = 'none';
      const txt = document.createElement('span');
      txt.style.cssText = "font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:.12em;color:#3ab0e2";
      txt.textContent = 'TRISHIELD';
      el.parentNode.insertBefore(txt, el.nextSibling);
    }
  });
}

/* ============================================================
   1. CINEMATIC INTRO / OPENING ANIMATION
   ============================================================ */
function runIntro() {
  const overlay     = document.getElementById('intro-overlay');
  const introCanvas = document.getElementById('intro-canvas');
  if (!overlay) { startMainAnimations(); return; }

  document.body.style.overflow = 'hidden';

  // ---- INTRO CANVAS: Digital rain + node network ----
  const ic = introCanvas.getContext('2d');
  introCanvas.width  = window.innerWidth;
  introCanvas.height = window.innerHeight;
  const W = introCanvas.width, H = introCanvas.height;

  // Node network in background
  const nodes = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.5 + .5, a: Math.random() * .3 + .05
  }));

  // Digital rain columns
  const cols    = Math.floor(W / 20);
  const drops   = Array.from({ length: cols }, () => Math.random() * -H);
  const chars   = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

  let animId;
  function drawIntro() {
    // Fade trail
    ic.fillStyle = 'rgba(2,10,18,0.18)';
    ic.fillRect(0, 0, W, H);

    // Digital rain
    ic.font = '12px monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x  = i * 20;
      // Bright head
      ic.fillStyle = `rgba(58,176,226,${Math.random() * .15 + .05})`;
      ic.fillText(ch, x, y);
      drops[i] = y > H + Math.random() * 500 ? -20 : y + 14;
    });

    // Node connections
    nodes.forEach((n, i) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      ic.beginPath();
      ic.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ic.fillStyle = `rgba(58,176,226,${n.a})`;
      ic.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d < 130) {
          ic.beginPath();
          ic.moveTo(n.x, n.y); ic.lineTo(m.x, m.y);
          ic.strokeStyle = `rgba(58,176,226,${.04 * (1 - d / 130)})`;
          ic.lineWidth = .5;
          ic.stroke();
        }
      }
    });
    animId = requestAnimationFrame(drawIntro);
  }
  drawIntro();

  // ---- SVG animation sequence ----
  const shield  = document.getElementById('ip-shield');
  const fill    = document.getElementById('ip-fill');
  const tLetter = document.getElementById('ip-t');
  const l1      = document.getElementById('ip-l1');
  const l2      = document.getElementById('ip-l2');
  const dots    = ['ip-d1','ip-d2','ip-d3','ip-d4','ip-d5','ip-d6'].map(id => document.getElementById(id));
  const divLine = document.getElementById('intro-divider-line');

  // Staggered SVG draws
  setTimeout(() => { if (shield)  { shield.style.strokeDashoffset  = '0'; } }, 900);
  setTimeout(() => { if (fill)    { fill.classList.add('show'); } }, 1600);
  setTimeout(() => { if (tLetter) { tLetter.classList.add('show'); } }, 1450);
  setTimeout(() => { if (l1)      { l1.classList.add('draw'); } }, 1750);
  setTimeout(() => { if (l2)      { l2.classList.add('draw'); } }, 1950);
  dots.forEach((d, i) => setTimeout(() => { if (d) d.style.opacity = '1'; }, 1600 + i * 80));
  setTimeout(() => { if (divLine) divLine.classList.add('expand'); }, 2500);

  // ---- Dismiss ----
  setTimeout(() => {
    cancelAnimationFrame(animId);
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    startMainAnimations();
  }, 3800);
}

/* ============================================================
   2. BACKGROUND PARTICLES CANVAS
   ============================================================ */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; initDots(); });

  const DOTS = [];
  function makeDot() { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * .9 + .3, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, a: Math.random() * .45 + .08 }; }
  function initDots() { DOTS.length = 0; for (let i = 0; i < 170; i++) DOTS.push(makeDot()); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    DOTS.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(58,176,226,${d.a})`; ctx.fill();
      for (let j = i + 1; j < DOTS.length; j++) {
        const e = DOTS[j], dx = d.x - e.x, dy = d.y - e.y, dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 115) { ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.strokeStyle = `rgba(58,176,226,${.055 * (1 - dist / 115)})`; ctx.lineWidth = .5; ctx.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  }
  initDots(); draw();
}

/* ============================================================
   3. THREE.JS HERO — Animated 3D Particle Network + Threat Arcs
   ============================================================ */
function initHeroThreeJS() {
  if (typeof THREE === 'undefined') return;

  const canvas   = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // Mouse tracking
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - .5) * 2;
    mouse.y = (e.clientY / window.innerHeight - .5) * 2;
  });

  // ---- PARTICLE NETWORK ----
  const NODE_COUNT = 180;
  const nodePositions = [];
  const nodeGeo  = new THREE.BufferGeometry();
  const nodePosArr = new Float32Array(NODE_COUNT * 3);
  const nodeSpeeds = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const x = (Math.random() - .5) * 200;
    const y = (Math.random() - .5) * 120;
    const z = (Math.random() - .5) * 60;
    nodePositions.push(new THREE.Vector3(x, y, z));
    nodePosArr[i * 3]     = x;
    nodePosArr[i * 3 + 1] = y;
    nodePosArr[i * 3 + 2] = z;
    nodeSpeeds.push({ x: (Math.random() - .5) * .08, y: (Math.random() - .5) * .08, z: (Math.random() - .5) * .04 });
  }
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));

  const nodeMat = new THREE.PointsMaterial({
    color: 0x3ab0e2, size: .8, transparent: true, opacity: .7,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.Points(nodeGeo, nodeMat));

  // ---- CONNECTION LINES ----
  const MAX_CONNECTIONS = 500;
  const linePositions = new Float32Array(MAX_CONNECTIONS * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0x3ab0e2, transparent: true, opacity: .15,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(lineMat);

  // ---- THREAT ARC SYSTEM ----
  // Threat origins (lat/lon approximations projected to screen coords)
  const threatOrigins = [
    { x: -70, y: 20 },
    { x: 20,  y: 30 },
    { x: 50,  y: 10 },
    { x: 70,  y: 15 },
    { x: -20, y: -20 },
    { x: 60,  y: -10 },
  ];
  const TARGET = { x: 5, y: -30 };

  const threatArcs = [];

  // Spawn arcs periodically — subtle, no counter display
  setInterval(() => {
    if (threatArcs.length < 4) {
      const origin = threatOrigins[Math.floor(Math.random() * threatOrigins.length)];
      const points = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const x = origin.x + (TARGET.x - origin.x) * t;
        const y = origin.y + (TARGET.y - origin.y) * t;
        points.push(new THREE.Vector3(x, y + Math.sin(t * Math.PI) * 28, -10));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo   = new THREE.TubeGeometry(curve, 40, .12, 4, false);
      const mat   = new THREE.MeshBasicMaterial({
        color: 0x3ab0e2, transparent: true, opacity: .4,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      threatArcs.push({ geometry: geo, material: mat, mesh, progress: 0, speed: .005 + Math.random() * .005 });
    }
  }, 3000);

  // ---- RESIZE ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- RENDER LOOP ----
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Update nodes
    const posAttr = nodeGeo.attributes.position;
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = nodePositions[i];
      const s = nodeSpeeds[i];
      p.x += s.x; p.y += s.y; p.z += s.z;
      if (Math.abs(p.x) > 100) s.x *= -1;
      if (Math.abs(p.y) > 60)  s.y *= -1;
      if (Math.abs(p.z) > 30)  s.z *= -1;
      posAttr.setXYZ(i, p.x, p.y, p.z);
    }
    posAttr.needsUpdate = true;

    // Update connections
    if (frame % 3 === 0) {
      let li = 0;
      for (let i = 0; i < NODE_COUNT && li < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < NODE_COUNT && li < MAX_CONNECTIONS; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 28) {
            const lp = lineMat.geometry.attributes.position;
            lp.setXYZ(li * 2,     nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
            lp.setXYZ(li * 2 + 1, nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
            li++;
          }
        }
      }
      lineMat.geometry.attributes.position.needsUpdate = true;
      lineMat.geometry.setDrawRange(0, li * 2);
    }

    // Update threat arcs
    for (let i = threatArcs.length - 1; i >= 0; i--) {
      const arc = threatArcs[i];
      arc.progress += arc.speed;
      if (arc.progress >= 1) {
        scene.remove(arc.mesh);
        arc.geometry.dispose(); arc.material.dispose();
        threatArcs.splice(i, 1);
      } else {
        arc.material.opacity = Math.sin(arc.progress * Math.PI) * .4;
      }
    }

    // Camera react to mouse
    camera.position.x += (mouse.x * 8 - camera.position.x) * .04;
    camera.position.y += (-mouse.y * 5 - camera.position.y) * .04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
}

/* ============================================================
   4. THREE.JS GLOBE
   ============================================================ */
function initGlobe() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const w = 400, h = 400;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.z = 3;

  // Globe wireframe
  const globeGeo = new THREE.SphereGeometry(1, 36, 36);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x1a3a5c, wireframe: true, transparent: true, opacity: .25
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // Solid core
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x0d1b2a, transparent: true, opacity: .8 });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(.99, 32, 32), coreMat));

  // Atmosphere glow
  const atmosGeo = new THREE.SphereGeometry(1.06, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({ color: 0x3ab0e2, transparent: true, opacity: .04, side: THREE.BackSide });
  scene.add(new THREE.Mesh(atmosGeo, atmosMat));

  // Location pins (lat/lon to 3D)
  function latLonToVec3(lat, lon, radius) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  const pins = [
    { lat: -29, lon: 25,  color: 0x3ab0e2, label: 'South Africa' },  // SA
    { lat:  -1, lon: 37,  color: 0xc8a84b, label: 'Kenya' },
    { lat:   9, lon:  8,  color: 0x3ae2a0, label: 'Nigeria' },
    { lat:  51, lon: -1,  color: 0xe05050, label: 'UK' }
  ];

  const pinMeshes = [];
  pins.forEach(pin => {
    const pos = latLonToVec3(pin.lat, pin.lon, 1.02);
    const pinGeo = new THREE.SphereGeometry(.032, 8, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: pin.color });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pos);
    scene.add(pinMesh);

    // Pulse ring
    const ringGeo = new THREE.RingGeometry(.04, .06, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: pin.color, transparent: true, opacity: .6, side: THREE.DoubleSide });
    const ring    = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(ring);
    pinMeshes.push({ ring, ringMat, phase: Math.random() * Math.PI * 2 });
  });

  // Connection arcs between SA and other pins
  const saPos  = latLonToVec3(-29, 25, 1.02);
  const arcPins = [
    { lat:  -1, lon: 37 },
    { lat:   9, lon:  8 },
    { lat:  51, lon: -1 }
  ];
  arcPins.forEach(p => {
    const toPos = latLonToVec3(p.lat, p.lon, 1.02);
    const mid   = new THREE.Vector3().addVectors(saPos, toPos).multiplyScalar(.5).normalize().multiplyScalar(1.35);
    const pts   = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(new THREE.Vector3().lerpVectors(saPos, toPos, t).lerp(mid, Math.sin(t * Math.PI) * .6).normalize().multiplyScalar(1.02));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x3ab0e2, transparent: true, opacity: .35 });
    scene.add(new THREE.Line(arcGeo, arcMat));
  });

  // Ambient light
  scene.add(new THREE.AmbientLight(0x3ab0e2, .3));

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += .005;
    globe.rotation.y += .003;

    // Pulse rings
    pinMeshes.forEach((p, i) => {
      const s = 1 + .4 * Math.sin(t * 2 + p.phase);
      p.ring.scale.set(s, s, 1);
      p.ringMat.opacity = .3 + .3 * Math.sin(t * 2 + p.phase);
      p.ring.rotation.copy(globe.rotation);
    });

    renderer.render(scene, camera);
  }
  animate();
}

/* ============================================================
   5. CURSOR
   ============================================================ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .13; ry += (my - ry) * .13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('button, a, .service-opt, .contact-card, .market-card, .team-card, .stat3d-card, .process-card, .tech-tag').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; ring.style.width = '50px'; ring.style.height = '50px'; ring.style.opacity = '.3'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '.5'; });
  });
}

/* ============================================================
   6. NAV — scroll behaviour + active link
   ============================================================ */
function initNav() {
  const nav      = document.getElementById('mainNav');
  const progress = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (progress) progress.style.width = p + '%';

    // Active link
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        navLinks.forEach(a => a.classList.remove('active-link'));
        const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ============================================================
   7. REVEAL ON SCROLL
   ============================================================ */
function initReveal() {
  const revEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: .1 });
  revEls.forEach(el => obs.observe(el));

  // Process steps
  const steps = document.querySelectorAll('.process-step');
  const stepsObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .15 });
  steps.forEach(s => stepsObs.observe(s));
}

/* ============================================================
   8. COUNTERS
   ============================================================ */
function initCounters() {
  // Metric counters (integer)
  const counters = document.querySelectorAll('.metric-num[data-target]');
  const cntObs   = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, target = +el.dataset.target;
        let n = 0; const inc = Math.max(1, Math.ceil(target / 50));
        const t = setInterval(() => { n = Math.min(n + inc, target); el.textContent = n; if (n >= target) clearInterval(t); }, 28);
        cntObs.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => cntObs.observe(c));

  // 3D stat counters (with decimal)
  const stat3d = document.querySelectorAll('.stat3d-num[data-count]');
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el    = e.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.count.includes('.');
        let n = 0; const duration = 1800; const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          n = target * eased;
          el.textContent = isDecimal ? n.toFixed(1) : Math.round(n);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObs.unobserve(el);
      }
    });
  }, { threshold: .4 });
  stat3d.forEach(s => statObs.observe(s));

  // Revenue bars
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.rev-bar-fill').forEach(b => { b.style.width = b.dataset.width + '%'; });
        barObs.disconnect();
      }
    });
  }, { threshold: .3 });
  const revSec = document.getElementById('revBars');
  if (revSec) barObs.observe(revSec);
}

/* ============================================================
   9. 3D CARD TILT EFFECT (Service Cards)
   ============================================================ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - .5;
      const y    = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
      card.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,.4), 0 0 30px rgba(58,176,226,.1)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ============================================================
   10. MODAL SYSTEM
   ============================================================ */
window.openModal  = function(id) { document.getElementById(id).classList.add('open');  document.body.style.overflow = 'hidden'; };
window.closeModal = function(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; };

document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});

/* ============================================================
   11. FORM UTILITIES
   ============================================================ */
window.toggleService = function(el) { el.classList.toggle('active'); };
window.updateBudget  = function() {
  const v = parseInt(document.getElementById('q-budget').value);
  document.getElementById('budgetDisplay').textContent = 'R ' + v.toLocaleString('en-ZA') + '/mo';
};

function showToast(title, msg, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent   = msg;
  document.getElementById('toast-icon').textContent  = type === 'success' ? '✅' : '❌';
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function getVal(id)     { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function getChecked(id) { const el = document.getElementById(id); return el ? el.checked : false; }

window.submitForm = function(type) {
  let valid = true, errorMsg = '';

  if (type === 'contact') {
    if (!getVal('c-fname'))              { valid = false; errorMsg = 'Please enter your first name.'; }
    else if (!getVal('c-lname'))         { valid = false; errorMsg = 'Please enter your last name.'; }
    else if (!validateEmail(getVal('c-email'))) { valid = false; errorMsg = 'Please enter a valid email address.'; }
    else if (!getVal('c-subject'))       { valid = false; errorMsg = 'Please select a subject.'; }
    else if (!getVal('c-message'))       { valid = false; errorMsg = 'Please enter your message.'; }
    else if (!getChecked('c-privacy'))   { valid = false; errorMsg = 'Please agree to the Privacy Policy.'; }
  }
  if (type === 'quote') {
    if (!getVal('q-name'))               { valid = false; errorMsg = 'Please enter your name.'; }
    else if (!validateEmail(getVal('q-email'))) { valid = false; errorMsg = 'Please enter a valid email.'; }
    else if (!getVal('q-company'))       { valid = false; errorMsg = 'Please enter your company name.'; }
    else if (!getVal('q-desc'))          { valid = false; errorMsg = 'Please describe your project.'; }
    else if (!getChecked('q-privacy'))   { valid = false; errorMsg = 'Please agree to the Privacy Policy.'; }
  }
  if (type === 'partnership') {
    if (!getVal('p-name'))               { valid = false; errorMsg = 'Please enter your name.'; }
    else if (!getVal('p-company'))       { valid = false; errorMsg = 'Please enter your company name.'; }
    else if (!validateEmail(getVal('p-email'))) { valid = false; errorMsg = 'Please enter a valid email.'; }
    else if (!getVal('p-type'))          { valid = false; errorMsg = 'Please select a partnership type.'; }
    else if (!getChecked('p-privacy'))   { valid = false; errorMsg = 'Please agree to the Privacy Policy.'; }
  }
  if (type === 'careers') {
    if (!getVal('j-name'))               { valid = false; errorMsg = 'Please enter your full name.'; }
    else if (!validateEmail(getVal('j-email'))) { valid = false; errorMsg = 'Please enter a valid email.'; }
    else if (!getVal('j-role'))          { valid = false; errorMsg = 'Please select a role.'; }
    else if (!getChecked('j-privacy'))   { valid = false; errorMsg = 'Please agree to the Privacy Policy.'; }
  }

  if (!valid) { showToast('Missing Information', errorMsg, 'error'); return; }

  const btn = document.querySelector(`#${type}-form-wrap .form-submit`);
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; btn.style.opacity = '.6'; }

  setTimeout(() => {
    // ---- REPLACE WITH REAL API CALL ----
    // fetch('https://api.trishield.co.za/enquiries', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, ...collectData(type) })
    // });
    // ------------------------------------

    document.getElementById(`${type}-form-wrap`).style.display = 'none';
    document.getElementById(`${type}-success`).style.display   = 'block';

    const msgs = {
      contact:     ["Message Sent!",        "We'll respond within 24 business hours."],
      quote:       ["Quote Requested!",     "Expect a tailored proposal in 2–3 days."],
      partnership: ["Enquiry Sent!",        "Our partnerships team will contact you soon."],
      careers:     ["Application In!",      "We review all applications carefully."]
    };
    showToast(msgs[type][0], msgs[type][1], 'success');
  }, 1400);
};

window.subscribeNewsletter = function() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!validateEmail(email)) { showToast('Invalid Email', 'Please enter a valid email address.', 'error'); return; }
  const btn = document.querySelector('.nl-form .btn-primary');
  btn.textContent = 'Subscribing...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Subscribed!';
    document.getElementById('nlEmail').value = '';
    showToast("Subscribed!", "You're on the list. Welcome to Trishield Insights.", 'success');
    setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3500);
  }, 1000);
};

/* ============================================================
   13. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
window.closeMobileMenu = function() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger)  hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};

/* ============================================================
   14. THREAT COUNTER AUTO-INCREMENT
   ============================================================ */
function initThreatCounter() {
  const el = document.getElementById('threat-count');
  if (!el) return;
  // Start at a realistic number
  let count = Math.floor(Math.random() * 800) + 4200;
  el.textContent = count.toLocaleString();
  // Increment every few seconds to simulate live blocking
  setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    el.textContent = count.toLocaleString();
  }, 3500);
}

/* ============================================================
   15. TECH TAG HOVER RIPPLE
   ============================================================ */
function initTechTags() {
  document.querySelectorAll('.tech-tag').forEach((tag, i) => {
    tag.style.animationDelay = (i * 0.05) + 's';
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-3px) scale(1.08)';
      tag.style.background = 'rgba(58,176,226,0.08)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
      tag.style.background = '';
    });
  });
}

/* ============================================================
   16. SMOOTH PAGE-LOAD (prevent FOUC)
   ============================================================ */
function preventFOUC() {
  document.body.style.visibility = 'hidden';
  window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
}

/* ============================================================
   17. PARALLAX HERO TEXT
   ============================================================ */
function initParallax() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSub   = document.querySelector('.hero-sub');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroTitle) heroTitle.style.transform = `translateY(${y * 0.3}px)`;
    if (heroSub)   heroSub.style.transform   = `translateY(${y * 0.15}px)`;
  });
}

/* ============================================================
   11. PRICING TABS
   ============================================================ */
function initPricingTabs() {
  const tabs      = document.querySelectorAll('.price-tab');
  const panels    = document.querySelectorAll('.price-panel');
  const indicator = document.getElementById('priceTabIndicator');
  if (!tabs.length || !indicator) return;

  function placeIndicator(tab) {
    indicator.style.left  = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  function replayEntrance(panel) {
    // Restart the fadeUp animation on the panel's cards each time it's shown
    panel.querySelectorAll('.price-card').forEach(card => {
      card.style.animation = 'none';
      void card.offsetWidth; // force reflow
      card.style.animation = '';
    });
  }

  const activeTab = document.querySelector('.price-tab.active') || tabs[0];
  placeIndicator(activeTab);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      placeIndicator(tab);

      const targetPanel = document.querySelector(`.price-panel[data-panel="${tab.dataset.tab}"]`);
      panels.forEach(p => p.classList.remove('active'));
      if (targetPanel) {
        targetPanel.classList.add('active');
        replayEntrance(targetPanel);
      }
    });
  });

  window.addEventListener('resize', () => {
    const current = document.querySelector('.price-tab.active');
    if (current) placeIndicator(current);
  });
}

/* ============================================================
   BOOT — run everything after DOM ready
   ============================================================ */
function startMainAnimations() {
  initBgCanvas();
  initHeroThreeJS();
  initGlobe();
  initCursor();
  initNav();
  initReveal();
  initCounters();
  initTilt();
  initPricingTabs();
  initMobileMenu();
  initTechTags();
  initParallax();
  injectLogos();
}

document.addEventListener('DOMContentLoaded', () => {
  runIntro();
});
