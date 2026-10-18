/**
 * ============================================================================
 * 20-10 ROMANTIC GIFT VIEWER - CLEAN RECIPIENT EXPERIENCE
 * Luxury 3D Envelope, 28,000 Particle Cloud (Heart/Tree), Lantern Effects
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Default Configuration & Data Decoder
  // --------------------------------------------------------------------------
  const DEFAULT_CONFIG = {
    title: 'Gửi Người Phụ Nữ Tôi Yêu Thương Nhất,',
    p1: 'Nhân ngày Phụ nữ Việt Nam 20/10, chúc em luôn luôn xinh đẹp, rạng rỡ như đóa hồng sớm mai ngát hương và ngập tràn hạnh phúc.',
    p2: 'Cảm ơn vì đã luôn mang đến sự ấm áp, nụ cười ngọt ngào và những điều tuyệt vời nhất cho thế giới này. Mong em mỗi ngày đều bình an, được yêu thương và nâng niu trọn vẹn!',
    quote: '"Bạn xứng đáng nhận được tất cả những điều dịu dàng và diệu kỳ nhất của cuộc sống này."',
    signature: '20 · 10 · Special Gift 🌸',
    shape: 'tree', // 'heart' | 'tree' | 'both'
    theme: 'pink',  // 'pink' | 'gold' | 'purple' | 'cyan'
    wishes: [
      {
        sender: 'Người thương',
        text: 'Cầu chúc em luôn an yên, mỉm cười thật tươi và luôn hạnh phúc mỗi ngày! 💖'
      },
      {
        sender: 'Trân trọng gửi trao',
        text: 'Chúc bạn một ngày 20/10 ngập tràn hoa, quà và những điều ngọt ngào nhất! 🌹'
      },
      {
        sender: 'Tình yêu dịu dàng',
        text: 'Dù ở bất cứ đâu, chúc người phụ nữ tuyệt vời luôn tỏa sáng rạng ngời! ✨'
      }
    ]
  };

  // Safe UTF-8 Base64 Decoder
  function decodeData(str) {
    try {
      const json = decodeURIComponent(escape(atob(decodeURIComponent(str))));
      return JSON.parse(json);
    } catch (e) {
      console.warn('Could not decode URL data, using fallback/stored config.', e);
      return null;
    }
  }

  // Load configuration from URL query (?d=...) or localStorage or Default
  const urlParams = new URLSearchParams(window.location.search);
  const rawData = urlParams.get('d');
  let CONFIG = null;

  if (rawData) {
    CONFIG = decodeData(rawData);
  }
  if (!CONFIG) {
    try {
      const stored = localStorage.getItem('20_10_gift_config');
      if (stored) CONFIG = JSON.parse(stored);
    } catch (e) {}
  }
  if (!CONFIG) {
    CONFIG = DEFAULT_CONFIG;
  }

  // Ensure fallback properties exist
  CONFIG = Object.assign({}, DEFAULT_CONFIG, CONFIG);

  // Apply Config to DOM Elements
  document.getElementById('letter-recipient-title').innerText = CONFIG.title;
  document.getElementById('letter-paragraph-1').innerText = CONFIG.p1;
  document.getElementById('letter-paragraph-2').innerText = CONFIG.p2;
  document.getElementById('letter-quote').innerText = CONFIG.quote;
  document.getElementById('letter-signature-name').innerText = CONFIG.signature;

  // --------------------------------------------------------------------------
  // Color Palettes
  // --------------------------------------------------------------------------
  const PALETTES = {
    pink: {
      primary: new THREE.Color('#ff2a8d'),
      secondary: new THREE.Color('#ff71ce'),
      accent: new THREE.Color('#ffffff'),
      halo: new THREE.Color('#e024c3'),
      trunk: new THREE.Color('#e5989b'),
      blossom: new THREE.Color('#ff69b4'),
    },
    gold: {
      primary: new THREE.Color('#fcd34d'),
      secondary: new THREE.Color('#fbbf24'),
      accent: new THREE.Color('#fffbeb'),
      halo: new THREE.Color('#f59e0b'),
      trunk: new THREE.Color('#b45309'),
      blossom: new THREE.Color('#fde68a'),
    },
    purple: {
      primary: new THREE.Color('#b5179e'),
      secondary: new THREE.Color('#7209b7'),
      accent: new THREE.Color('#f1faee'),
      halo: new THREE.Color('#4361ee'),
      trunk: new THREE.Color('#480ca8'),
      blossom: new THREE.Color('#c77dff'),
    },
    cyan: {
      primary: new THREE.Color('#48cae4'),
      secondary: new THREE.Color('#00b4d8'),
      accent: new THREE.Color('#ffffff'),
      halo: new THREE.Color('#0077b6'),
      trunk: new THREE.Color('#03045e'),
      blossom: new THREE.Color('#90e0ef'),
    }
  };

  const currentPal = PALETTES[CONFIG.theme] || PALETTES.pink;

  // --------------------------------------------------------------------------
  // Web Audio Romantic Music Engine
  // --------------------------------------------------------------------------
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingMusic = false;
      this.musicTimer = null;
      this.currentChord = 0;
      this.chords = [
        [174.61, 220.00, 261.63, 329.63, 349.23, 440.00], // Fmaj9
        [220.00, 261.63, 329.63, 392.00, 440.00, 523.25], // Am7
        [233.08, 293.66, 349.23, 440.00, 466.16, 587.33], // Bbmaj9
        [130.81, 196.00, 261.63, 349.23, 392.00, 523.25]  // C7sus4
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playNote(freq, time, duration = 1.8, gainVal = 0.08) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(400, time + duration);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainVal, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    }

    startAmbientMusic() {
      this.init();
      if (this.isPlayingMusic) return;
      this.isPlayingMusic = true;

      const scheduleArpeggio = () => {
        if (!this.isPlayingMusic) return;
        const now = this.ctx.currentTime;
        const chord = this.chords[this.currentChord];
        this.currentChord = (this.currentChord + 1) % this.chords.length;

        const pattern = [0, 2, 4, 1, 3, 5, 2, 4];
        pattern.forEach((idx, step) => {
          const noteTime = now + step * 0.45;
          const freq = chord[idx % chord.length];
          this.playNote(freq, noteTime, 2.2, 0.05);
        });

        this.musicTimer = setTimeout(scheduleArpeggio, pattern.length * 450);
      };

      scheduleArpeggio();
    }

    stopAmbientMusic() {
      this.isPlayingMusic = false;
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }

    toggleMusic() {
      if (this.isPlayingMusic) {
        this.stopAmbientMusic();
        return false;
      } else {
        this.startAmbientMusic();
        return true;
      }
    }

    playEnvelopeOpen() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        this.playNote(f, now + i * 0.08, 1.4, 0.1);
      });
    }

    playDissolveBurst() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((f, i) => {
        this.playNote(f, now + i * 0.06, 2.0, 0.08);
      });
    }

    playHeartbeat() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const createThump = (t, freq, duration) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + duration);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + duration);
      };
      createThump(now, 75, 0.22);
      createThump(now + 0.26, 65, 0.25);
    }

    // High crystal fairy chime for lantern click
    playLanternChime() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [1174.66, 1479.98, 1760.00, 2217.46, 2959.96].forEach((f, i) => {
        this.playNote(f, now + i * 0.055, 1.5, 0.12);
      });
    }
  }

  const audio = new RomanticAudioEngine();

  // --------------------------------------------------------------------------
  // Three.js Scene Setup
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('webgl-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07020d, 0.018);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 26);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 65;
  controls.minDistance = 10;
  controls.maxPolarAngle = Math.PI / 2 + 0.2;
  controls.enabled = false;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffe6f2, 1.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(currentPal.primary, 2.5, 50);
  pointLight1.position.set(0, 4, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xfcd34d, 1.8, 40);
  pointLight2.position.set(0, -5, 5);
  scene.add(pointLight2);

  // --------------------------------------------------------------------------
  // Particle Texture Generator
  // --------------------------------------------------------------------------
  function createParticleTexture() {
    const size = 128;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = size;
    texCanvas.height = size;
    const ctx = texCanvas.getContext('2d');
    const center = size / 2;

    const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.18, 'rgba(255, 230, 245, 0.95)');
    grad.addColorStop(0.42, 'rgba(255, 60, 160, 0.6)');
    grad.addColorStop(0.72, 'rgba(220, 20, 120, 0.15)');
    grad.addColorStop(1.0, 'rgba(180, 0, 100, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleTexture = createParticleTexture();

  // Background Starfield
  function createStarfield() {
    const count = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const isColor = Math.random() > 0.6;
      col[i * 3] = isColor ? currentPal.primary.r : 0.85;
      col[i * 3 + 1] = isColor ? currentPal.primary.g : 0.9;
      col[i * 3 + 2] = isColor ? currentPal.primary.b : 1.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8
    });

    return new THREE.Points(geo, mat);
  }

  const starsMesh = createStarfield();
  scene.add(starsMesh);

  // Floating sparkling embers around center space
  function createAmbientEmbers() {
    const count = 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const isPink = Math.random() > 0.5;
      col[i * 3] = isPink ? currentPal.primary.r : 0.99;
      col[i * 3 + 1] = isPink ? currentPal.primary.g : 0.83;
      col[i * 3 + 2] = isPink ? currentPal.primary.b : 0.30;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    return new THREE.Points(geo, mat);
  }

  const embersMesh = createAmbientEmbers();
  scene.add(embersMesh);

  // --------------------------------------------------------------------------
  // The 28,000 Particle Cloud (Heart & Tree) - NO FALLING PETALS
  // --------------------------------------------------------------------------
  const PARTICLE_COUNT = 28000;

  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
  const targetColors = new Float32Array(PARTICLE_COUNT * 3);
  const currentVelocities = new Float32Array(PARTICLE_COUNT * 3);

  const coordsHeart = new Float32Array(PARTICLE_COUNT * 3);
  const colorsHeart = new Float32Array(PARTICLE_COUNT * 3);
  const coordsTree = new Float32Array(PARTICLE_COUNT * 3);
  const colorsTree = new Float32Array(PARTICLE_COUNT * 3);
  const coordsLetter = new Float32Array(PARTICLE_COUNT * 3);
  const particleMeta = [];

  function computeParticleShapes() {
    // 1. Initial Letter Bounds Target
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const lx = (Math.random() - 0.5) * 7.8;
      const ly = (Math.random() - 0.5) * 9.0 + 2.0;
      const lz = (Math.random() - 0.5) * 0.3 + 0.1;

      coordsLetter[i * 3] = lx;
      coordsLetter[i * 3 + 1] = ly;
      coordsLetter[i * 3 + 2] = lz;

      positions[i * 3] = lx;
      positions[i * 3 + 1] = ly;
      positions[i * 3 + 2] = lz;
      targetPositions[i * 3] = lx;
      targetPositions[i * 3 + 1] = ly;
      targetPositions[i * 3 + 2] = lz;
    }

    // 2. Radiant Particle Heart (Matches User's Reference Image)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      let x, y, z;
      const pColor = new THREE.Color();
      const rand = Math.random();

      if (rand < 0.45) {
        // Dense Heart Boundary (Sharp, glowing contour)
        const s = 0.58;
        const scatter = (Math.random() - 0.5) * 0.4;
        x = hx * s + scatter;
        y = hy * s + scatter + 2.2;
        z = (Math.random() - 0.5) * 1.6;

        pColor.copy(Math.random() > 0.6 ? currentPal.accent : currentPal.primary);
      } else if (rand < 0.80) {
        // Outer Glittering Stardust Halo / Aura
        const aura = 1.05 + Math.random() * 0.45;
        const s = 0.58 * aura;
        x = hx * s + (Math.random() - 0.5) * 1.8;
        y = hy * s + (Math.random() - 0.5) * 1.8 + 2.2;
        z = (Math.random() - 0.5) * 4.5;

        pColor.copy(currentPal.secondary);
        if (Math.random() > 0.5) pColor.lerp(currentPal.halo, 0.6);
      } else {
        // Inner Mist / Dust
        const inner = 0.15 + Math.random() * 0.78;
        const s = 0.58 * inner;
        x = hx * s + (Math.random() - 0.5) * 1.2;
        y = hy * s + (Math.random() - 0.5) * 1.2 + 2.2;
        z = (Math.random() - 0.5) * 2.2;

        pColor.copy(currentPal.blossom).lerp(currentPal.primary, 0.4);
      }

      coordsHeart[i * 3] = x;
      coordsHeart[i * 3 + 1] = y;
      coordsHeart[i * 3 + 2] = z;

      colorsHeart[i * 3] = pColor.r;
      colorsHeart[i * 3 + 1] = pColor.g;
      colorsHeart[i * 3 + 2] = pColor.b;
    }

    // 3. 3D Wishing Tree (Full, Stable Canopy - NO PETALS FALLING)
    const trunkCount = Math.floor(PARTICLE_COUNT * 0.18);
    const branchCount = Math.floor(PARTICLE_COUNT * 0.22);
    const blossomCount = PARTICLE_COUNT - trunkCount - branchCount;

    for (let i = 0; i < trunkCount; i++) {
      const u = i / trunkCount;
      const y = -12 + u * 12;
      const baseFlare = y < -9 ? Math.pow((-9 - y) / 3, 1.8) * 1.8 : 0;
      const r = (1.4 - u * 0.6) + baseFlare + (Math.random() - 0.5) * 0.3;
      const angle = u * Math.PI * 6 + Math.random() * Math.PI * 2;

      coordsTree[i * 3] = Math.cos(angle) * r;
      coordsTree[i * 3 + 1] = y;
      coordsTree[i * 3 + 2] = Math.sin(angle) * r;

      const tColor = new THREE.Color(currentPal.trunk).lerp(currentPal.primary, u * 0.35);
      colorsTree[i * 3] = tColor.r;
      colorsTree[i * 3 + 1] = tColor.g;
      colorsTree[i * 3 + 2] = tColor.b;

      particleMeta[i] = { type: 'trunk', origY: y };
    }

    const branchNodes = [
      { start: new THREE.Vector3(0, -1, 0), dir: new THREE.Vector3(1, 0.7, 0.4).normalize(), len: 9 },
      { start: new THREE.Vector3(0, 0, 0), dir: new THREE.Vector3(-0.9, 0.8, 0.5).normalize(), len: 8.5 },
      { start: new THREE.Vector3(0, 1, 0), dir: new THREE.Vector3(0.3, 0.9, -1.0).normalize(), len: 9 },
      { start: new THREE.Vector3(0, 1.5, 0), dir: new THREE.Vector3(-0.8, 0.7, -0.6).normalize(), len: 8 },
      { start: new THREE.Vector3(0, 2.5, 0), dir: new THREE.Vector3(0.7, 0.9, -0.3).normalize(), len: 8.5 },
      { start: new THREE.Vector3(0, 3.2, 0), dir: new THREE.Vector3(0.0, 1.0, 0.8).normalize(), len: 7.5 },
    ];

    for (let i = 0; i < branchCount; i++) {
      const idx = trunkCount + i;
      const node = branchNodes[i % branchNodes.length];
      const prog = Math.random();
      const dist = prog * node.len;
      const arch = Math.sin(prog * Math.PI) * 1.5;

      coordsTree[idx * 3] = node.start.x + node.dir.x * dist + (Math.random() - 0.5) * 0.8;
      coordsTree[idx * 3 + 1] = node.start.y + node.dir.y * dist + arch + (Math.random() - 0.5) * 0.8;
      coordsTree[idx * 3 + 2] = node.start.z + node.dir.z * dist + (Math.random() - 0.5) * 0.8;

      const bColor = new THREE.Color(currentPal.trunk).lerp(currentPal.blossom, prog * 0.8);
      colorsTree[idx * 3] = bColor.r;
      colorsTree[idx * 3 + 1] = bColor.g;
      colorsTree[idx * 3 + 2] = bColor.b;

      particleMeta[idx] = { type: 'branch', origY: coordsTree[idx * 3 + 1] };
    }

    for (let i = 0; i < blossomCount; i++) {
      const idx = trunkCount + branchCount + i;
      let cx, cy, cz;

      if (Math.random() < 0.35) {
        const b = branchNodes[i % branchNodes.length];
        cx = b.start.x + b.dir.x * b.len;
        cy = b.start.y + b.dir.y * b.len + 1.2;
        cz = b.start.z + b.dir.z * b.len;
      } else {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.6;
        const radius = 3.5 + Math.random() * 8.5;
        cx = Math.sin(phi) * Math.cos(theta) * radius;
        cy = 5.5 + Math.cos(phi) * radius * 0.7;
        cz = Math.sin(phi) * Math.sin(theta) * radius;
      }

      const spread = 2.4;
      const fx = cx + (Math.random() - 0.5) * spread;
      const fy = cy + (Math.random() - 0.5) * spread;
      const fz = cz + (Math.random() - 0.5) * spread;

      coordsTree[idx * 3] = fx;
      coordsTree[idx * 3 + 1] = fy;
      coordsTree[idx * 3 + 2] = fz;

      const cColor = new THREE.Color();
      const randColor = Math.random();
      if (randColor < 0.5) {
        cColor.copy(currentPal.blossom);
      } else if (randColor < 0.85) {
        cColor.copy(currentPal.primary);
      } else {
        cColor.copy(currentPal.accent);
      }

      colorsTree[idx * 3] = cColor.r;
      colorsTree[idx * 3 + 1] = cColor.g;
      colorsTree[idx * 3 + 2] = cColor.b;

      // All blossom particles stay securely on the tree (NO falling leaves)
      particleMeta[idx] = {
        type: 'blossom',
        origX: fx,
        origY: fy,
        origZ: fz
      };
    }
  }

  computeParticleShapes();

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.75,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.0
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // --------------------------------------------------------------------------
  // Hanging Wish Lanterns on Tree or Heart
  // --------------------------------------------------------------------------
  const lanternMeshes = [];

  function createHangingLanterns() {
    lanternMeshes.forEach(l => scene.remove(l));
    lanternMeshes.length = 0;

    const list = CONFIG.wishes || [];
    list.forEach((item, index) => {
      const lanternGroup = new THREE.Group();

      // Golden cord
      const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
      const cord = new THREE.Mesh(cordGeo, new THREE.MeshBasicMaterial({ color: 0xfcd34d }));
      cord.position.y = 0.7;
      lanternGroup.add(cord);

      // Glowing crystal bulb
      const bulbGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const bulbMat = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? currentPal.primary : 0xfcd34d,
        transparent: true,
        opacity: 0.95
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      lanternGroup.add(bulb);

      // Paper Tag
      const tagGeo = new THREE.PlaneGeometry(0.65, 0.95);
      const tag = new THREE.Mesh(tagGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
      tag.position.y = -0.7;
      lanternGroup.add(tag);

      // Determine position based on target shape
      let pos;
      if (CONFIG.shape === 'heart') {
        const t = (index / Math.max(1, list.length)) * Math.PI * 2 + 0.3;
        const s = 0.58;
        const hx = 16 * Math.pow(Math.sin(t), 3) * s;
        const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s + 2.2;
        pos = new THREE.Vector3(hx, hy, (Math.random() - 0.5) * 1.5);
      } else {
        const angle = (index / Math.max(1, list.length)) * Math.PI * 2;
        const r = 3.5 + (index % 3) * 2.0;
        const y = 4.5 + (index % 4) * 1.5;
        pos = new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);
      }

      lanternGroup.position.copy(pos);
      lanternGroup.userData = {
        wishData: item,
        bulbMesh: bulb,
        initialY: pos.y,
        bobPhase: Math.random() * Math.PI * 2
      };

      scene.add(lanternGroup);
      lanternMeshes.push(lanternGroup);
    });
  }

  // --------------------------------------------------------------------------
  // Spectacular Lantern Click Effects (Burst, Ring, Sway, Audio)
  // --------------------------------------------------------------------------
  const lanternSparkCount = 160;
  const lanternSparkGeo = new THREE.BufferGeometry();
  const lanternSparkPos = new Float32Array(lanternSparkCount * 3);
  const lanternSparkCol = new Float32Array(lanternSparkCount * 3);
  const lanternSparkVel = [];

  for (let i = 0; i < lanternSparkCount; i++) {
    lanternSparkPos[i * 3] = 0;
    lanternSparkPos[i * 3 + 1] = -100;
    lanternSparkPos[i * 3 + 2] = 0;
    lanternSparkVel.push(new THREE.Vector3(0, 0, 0));
  }

  lanternSparkGeo.setAttribute('position', new THREE.BufferAttribute(lanternSparkPos, 3));
  lanternSparkGeo.setAttribute('color', new THREE.BufferAttribute(lanternSparkCol, 3));

  const lanternSparkMat = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.95
  });

  const lanternSparkMesh = new THREE.Points(lanternSparkGeo, lanternSparkMat);
  scene.add(lanternSparkMesh);

  // Expanding shockwave ring
  const ringGeo = new THREE.RingGeometry(0.2, 0.45, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfcd34d,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  });
  const shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
  shockwaveRing.position.set(0, -100, 0);
  scene.add(shockwaveRing);

  function triggerLanternClickEffect(worldPos, lanternGroup) {
    audio.playLanternChime();

    // 1. Spurt glittering fairy sparkles outward
    for (let i = 0; i < lanternSparkCount; i++) {
      lanternSparkPos[i * 3] = worldPos.x;
      lanternSparkPos[i * 3 + 1] = worldPos.y;
      lanternSparkPos[i * 3 + 2] = worldPos.z;

      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.22 + Math.random() * 0.42;

      lanternSparkVel[i].set(
        Math.sin(phi) * Math.cos(angle) * speed,
        Math.sin(phi) * Math.sin(angle) * speed,
        Math.cos(phi) * speed
      );

      const isGold = Math.random() > 0.4;
      lanternSparkCol[i * 3] = isGold ? 0.99 : currentPal.primary.r;
      lanternSparkCol[i * 3 + 1] = isGold ? 0.83 : currentPal.primary.g;
      lanternSparkCol[i * 3 + 2] = isGold ? 0.30 : currentPal.primary.b;
    }
    lanternSparkGeo.attributes.position.needsUpdate = true;
    lanternSparkGeo.attributes.color.needsUpdate = true;

    // 2. Expanding shockwave ring
    shockwaveRing.position.copy(worldPos);
    shockwaveRing.lookAt(camera.position);
    shockwaveRing.scale.set(0.4, 0.4, 0.4);
    ringMat.opacity = 0.95;
    ringMat.color.set(currentPal.primary);

    new TWEEN.Tween(shockwaveRing.scale)
      .to({ x: 3.8, y: 3.8, z: 3.8 }, 750)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(ringMat)
      .to({ opacity: 0 }, 750)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // 3. Pendulum bell sway
    new TWEEN.Tween(lanternGroup.rotation)
      .to({ z: 0.45 }, 180)
      .easing(TWEEN.Easing.Quadratic.Out)
      .chain(
        new TWEEN.Tween(lanternGroup.rotation)
          .to({ z: -0.35 }, 240)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .chain(
            new TWEEN.Tween(lanternGroup.rotation)
              .to({ z: 0.18 }, 200)
              .chain(new TWEEN.Tween(lanternGroup.rotation).to({ z: 0 }, 220))
          )
      )
      .start();

    // 4. Bulb temporary flash
    if (lanternGroup.userData.bulbMesh) {
      new TWEEN.Tween(lanternGroup.userData.bulbMesh.scale)
        .to({ x: 1.5, y: 1.5, z: 1.5 }, 150)
        .yoyo(true)
        .repeat(1)
        .start();
    }
  }

  // --------------------------------------------------------------------------
  // User Interaction & Transition Sequence
  // --------------------------------------------------------------------------
  let phase = 'ENVELOPE'; // 'ENVELOPE' | 'LETTER' | 'PARTICLES'
  let activeShape = CONFIG.shape;

  const envelopeStageEl = document.getElementById('envelope-stage');
  const luxuryEnvelopeEl = document.getElementById('luxury-envelope');
  const envelopePromptEl = document.getElementById('envelope-prompt');
  const letterModalEl = document.getElementById('letter-modal');
  const viewerControlsEl = document.getElementById('viewer-controls');
  const btnDissolve = document.getElementById('btn-dissolve');
  const readerCard = document.getElementById('wish-reader-card');
  const readerContent = document.getElementById('reader-content');
  const readerAuthor = document.getElementById('reader-author');

  function openLuxuryEnvelope() {
    if (phase !== 'ENVELOPE') return;
    phase = 'LETTER';

    audio.playEnvelopeOpen();
    if (!audio.isPlayingMusic) {
      audio.startAmbientMusic();
      const btnMusic = document.getElementById('btn-music');
      if (btnMusic) btnMusic.classList.add('playing');
    }

    // 1. Trigger luxury 3D envelope opening animation
    luxuryEnvelopeEl.classList.add('opened');

    // 2. Hide click prompt
    envelopePromptEl.style.opacity = '0';

    // 3. Reveal Letter Card smoothly
    setTimeout(() => {
      letterModalEl.classList.remove('hidden');
    }, 700);
  }

  // Click on envelope or prompt pill
  luxuryEnvelopeEl.addEventListener('click', openLuxuryEnvelope);
  envelopePromptEl.addEventListener('click', openLuxuryEnvelope);

  // Dissolve button
  btnDissolve.addEventListener('click', () => {
    if (phase !== 'LETTER') return;
    phase = 'PARTICLES';

    audio.playDissolveBurst();
    letterModalEl.classList.add('hidden');

    // Smoothly hide luxury envelope stage
    envelopeStageEl.classList.add('hidden');

    particleMat.opacity = 1.0;

    // Initial shockwave
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.8;
      currentVelocities[i * 3] = Math.cos(angle) * speed;
      currentVelocities[i * 3 + 1] = Math.sin(angle) * speed;
      currentVelocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 2;
    }

    // Camera move
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 1.5, z: 30 }, 1800)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // Transition based on chosen shape
    setTimeout(() => {
      controls.enabled = true;
      viewerControlsEl.classList.remove('hidden');

      if (CONFIG.shape === 'heart') {
        morphToHeart();
      } else if (CONFIG.shape === 'tree') {
        morphToTree();
      } else {
        // 'both': Heart first, then tree!
        morphToHeart();
        setTimeout(() => {
          morphToTree();
        }, 4500);
      }
    }, 900);
  });

  function morphToHeart() {
    activeShape = 'heart';
    controls.target.set(0, 1.5, 0);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      targetPositions[i * 3] = coordsHeart[i * 3];
      targetPositions[i * 3 + 1] = coordsHeart[i * 3 + 1];
      targetPositions[i * 3 + 2] = coordsHeart[i * 3 + 2];

      targetColors[i * 3] = colorsHeart[i * 3];
      targetColors[i * 3 + 1] = colorsHeart[i * 3 + 1];
      targetColors[i * 3 + 2] = colorsHeart[i * 3 + 2];
    }

    audio.playHeartbeat();
    setTimeout(() => createHangingLanterns(), 1200);
  }

  function morphToTree() {
    activeShape = 'tree';
    controls.target.set(0, 2, 0);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      targetPositions[i * 3] = coordsTree[i * 3];
      targetPositions[i * 3 + 1] = coordsTree[i * 3 + 1];
      targetPositions[i * 3 + 2] = coordsTree[i * 3 + 2];

      targetColors[i * 3] = colorsTree[i * 3];
      targetColors[i * 3 + 1] = colorsTree[i * 3 + 1];
      targetColors[i * 3 + 2] = colorsTree[i * 3 + 2];
    }

    setTimeout(() => createHangingLanterns(), 1200);
  }

  // Reopen letter button
  document.getElementById('btn-reopen-letter').addEventListener('click', () => {
    letterModalEl.classList.remove('hidden');
  });

  // Music button
  const btnMusic = document.getElementById('btn-music');
  btnMusic.addEventListener('click', () => {
    const isPlaying = audio.toggleMusic();
    btnMusic.classList.toggle('playing', isPlaying);
  });

  // Fullscreen button
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Close wish reader
  document.getElementById('btn-close-reader').addEventListener('click', () => {
    readerCard.classList.add('hidden');
  });

  // Raycaster for canvas click
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    if (e.target !== canvas) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (phase === 'PARTICLES') {
      const intersects = raycaster.intersectObjects(lanternMeshes, true);
      if (intersects.length > 0) {
        let hitGroup = intersects[0].object;
        while (hitGroup.parent && !hitGroup.userData.wishData) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup.userData.wishData) {
          const w = hitGroup.userData.wishData;
          readerContent.innerText = `"${w.text}"`;
          readerAuthor.innerText = `— ${w.sender}`;
          readerCard.classList.remove('hidden');

          // Trigger spectacular lantern effects
          triggerLanternClickEffect(hitGroup.position, hitGroup);
        }
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown);

  // --------------------------------------------------------------------------
  // Main Animation Loop
  // --------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    TWEEN.update();

    // 1. Stars & Embers Slow Drift
    starsMesh.rotation.y = elapsedTime * 0.012;
    embersMesh.rotation.y = elapsedTime * 0.02;

    // 2. Update Lantern Sparkles
    for (let i = 0; i < lanternSparkCount; i++) {
      lanternSparkPos[i * 3] += lanternSparkVel[i].x;
      lanternSparkPos[i * 3 + 1] += lanternSparkVel[i].y;
      lanternSparkPos[i * 3 + 2] += lanternSparkVel[i].z;

      lanternSparkVel[i].y -= 0.005; // Gentle gravity
      lanternSparkVel[i].multiplyScalar(0.96); // Air drag
    }
    lanternSparkGeo.attributes.position.needsUpdate = true;

    // 3. Particles Morph & Wind Sway
    if (particleMat.opacity > 0) {
      const posArr = particleGeo.attributes.position.array;
      const colArr = particleGeo.attributes.color.array;

      let heartScale = 1.0;
      if (activeShape === 'heart') {
        const beatCycle = elapsedTime % 1.25;
        if (beatCycle < 0.18) {
          heartScale = 1.0 + Math.sin((beatCycle / 0.18) * Math.PI) * 0.12;
        } else if (beatCycle > 0.28 && beatCycle < 0.44) {
          heartScale = 1.0 + Math.sin(((beatCycle - 0.28) / 0.16) * Math.PI) * 0.07;
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        let tx = targetPositions[idx];
        let ty = targetPositions[idx + 1];
        let tz = targetPositions[idx + 2];

        if (activeShape === 'heart') {
          tx *= heartScale;
          ty = (ty - 2.2) * heartScale + 2.2;
          tz *= heartScale;
        } else {
          // Tree wind sway (NO particles fall down, canopy stays full and stable)
          const meta = particleMeta[i];
          if (meta && (meta.type === 'blossom' || meta.type === 'branch')) {
            const heightFactor = Math.max(0, (ty + 10) / 20);
            tx += Math.sin(elapsedTime * 1.5 + ty * 0.3) * 0.22 * heightFactor;
            tz += Math.cos(elapsedTime * 1.2 + tx * 0.2) * 0.18 * heightFactor;
          }
        }

        const ease = 0.055;
        posArr[idx] += (tx - posArr[idx]) * ease + currentVelocities[idx];
        posArr[idx + 1] += (ty - posArr[idx + 1]) * ease + currentVelocities[idx + 1];
        posArr[idx + 2] += (tz - posArr[idx + 2]) * ease + currentVelocities[idx + 2];

        currentVelocities[idx] *= 0.92;
        currentVelocities[idx + 1] *= 0.92;
        currentVelocities[idx + 2] *= 0.92;

        colArr[idx] += (targetColors[idx] - colArr[idx]) * 0.06;
        colArr[idx + 1] += (targetColors[idx + 1] - colArr[idx + 1]) * 0.06;
        colArr[idx + 2] += (targetColors[idx + 2] - colArr[idx + 2]) * 0.06;
      }

      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.color.needsUpdate = true;
    }

    // 4. Lanterns gentle bobbing
    lanternMeshes.forEach(l => {
      l.position.y = l.userData.initialY + Math.sin(elapsedTime * 1.8 + l.userData.bobPhase) * 0.15;
    });

    if (controls.enabled) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

})();
