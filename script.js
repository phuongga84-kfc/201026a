/**
 * ============================================================================
 * 20-10 VIETNAMESE WOMEN'S DAY - 3D ROMANTIC CELEBRATION
 * Interactive 3D WebGL Experience: Envelope -> Heart Particles -> Wishing Tree
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration & State
  // --------------------------------------------------------------------------
  const CONFIG = {
    particleCount: 28000,
    petalCount: 1600,
    baseHeartScale: 0.58,
    treeHeight: 22,
    treeSpread: 12,
    cameraStartPos: { x: 0, y: 0, z: 26 },
    cameraTreePos: { x: 0, y: 2, z: 32 },
  };

  const STATE = {
    phase: 'ENVELOPE', // 'ENVELOPE' | 'LETTER' | 'DISSOLVING' | 'HEART' | 'TREE'
    morphTarget: 'TREE', // 'HEART' | 'TREE'
    audioEnabled: false,
    colorTheme: 'pink', // 'pink' | 'gold' | 'purple' | 'cyan'
    recipientRole: 'lover',
    customWish: null,
    hangingWishes: [
      {
        sender: 'Con yêu mẹ',
        text: 'Cầu chúc Mẹ luôn mạnh khỏe, bình an và nụ cười luôn nở trên môi. Mẹ là người phụ nữ vĩ đại nhất đời con! 💖',
        position: new THREE.Vector3(-4.5, 6.2, 3.8)
      },
      {
        sender: 'Người thương em',
        text: 'Chúc em một ngày 20/10 ngập tràn niềm vui. Mong em luôn hạnh phúc, dịu dàng và được yêu thương trọn vẹn! 🌹',
        position: new THREE.Vector3(5.2, 7.5, -2.4)
      },
      {
        sender: 'Tất cả sự trân trọng',
        text: 'Chúc phái đẹp Việt Nam luôn tự tin, rực rỡ và luôn là nguồn cảm hứng tuyệt vời nhất cho thế giới này! ✨',
        position: new THREE.Vector3(-1.8, 9.4, -4.2)
      }
    ]
  };

  // Color Palettes
  const PALETTES = {
    pink: {
      name: 'Hồng Lãng Mạn (Sakura)',
      primary: new THREE.Color('#ff2a8d'),
      secondary: new THREE.Color('#ff71ce'),
      accent: new THREE.Color('#ffffff'),
      halo: new THREE.Color('#e024c3'),
      trunk: new THREE.Color('#e5989b'),
      blossom: new THREE.Color('#ff69b4'),
    },
    gold: {
      name: 'Vàng Ánh Kim (Rose Gold)',
      primary: new THREE.Color('#fcd34d'),
      secondary: new THREE.Color('#fbbf24'),
      accent: new THREE.Color('#fffbeb'),
      halo: new THREE.Color('#f59e0b'),
      trunk: new THREE.Color('#b45309'),
      blossom: new THREE.Color('#fde68a'),
    },
    purple: {
      name: 'Tím Huyền Ảo (Lavender)',
      primary: new THREE.Color('#b5179e'),
      secondary: new THREE.Color('#7209b7'),
      accent: new THREE.Color('#f1faee'),
      halo: new THREE.Color('#4361ee'),
      trunk: new THREE.Color('#480ca8'),
      blossom: new THREE.Color('#c77dff'),
    },
    cyan: {
      name: 'Lam Ngọc Tinh Khôi (Crystal)',
      primary: new THREE.Color('#48cae4'),
      secondary: new THREE.Color('#00b4d8'),
      accent: new THREE.Color('#ffffff'),
      halo: new THREE.Color('#0077b6'),
      trunk: new THREE.Color('#03045e'),
      blossom: new THREE.Color('#90e0ef'),
    }
  };

  // Recipient Greeting Presets
  const GREETINGS = {
    lover: {
      title: 'Gửi Người Phụ Nữ Tôi Yêu Thương Nhất,',
      p1: 'Nhân ngày Phụ nữ Việt Nam 20/10, chúc em luôn luôn xinh đẹp, rạng rỡ như đóa hồng sớm mai ngát hương và ngập tràn hạnh phúc.',
      p2: 'Cảm ơn vì đã luôn mang đến sự ấm áp, nụ cười ngọt ngào và những điều tuyệt vời nhất cho thế giới này. Mong em mỗi ngày đều bình an, được yêu thương và nâng niu trọn vẹn!',
      quote: '"Bạn xứng đáng nhận được tất cả những điều dịu dàng và diệu kỳ nhất của cuộc sống này."'
    },
    mother: {
      title: 'Kính Gửi Mẹ Yêu Dấu Của Con,',
      p1: 'Ngày 20/10, con kính chúc Mẹ luôn dồi dào sức khỏe, an vui và mãi giữ nụ cười hiền hậu trên môi. Cảm ơn Mẹ vì bao năm tháng hy sinh và yêu thương vô bờ bến.',
      p2: 'Với con, được thấy Mẹ mạnh khỏe và hạnh phúc mỗi ngày chính là điều tuyệt vời và thiêng liêng nhất.',
      quote: '"Đi khắp thế gian không ai tốt bằng Mẹ, gánh nặng cuộc đời không ai khổ bằng Cha."'
    },
    sister: {
      title: 'Thân Gửi Chị / Em Gái Yêu Quý,',
      p1: 'Chúc chị/em ngày 20/10 ngập tràn niềm vui, luôn tươi trẻ, tự tin và gặt hái thật nhiều thành công trên con đường mình đã chọn.',
      p2: 'Hãy luôn yêu thương bản thân, cười thật nhiều và luôn là niềm tự hào rạng rỡ của gia đình nhé!',
      quote: '"Hãy luôn tỏa sáng theo cách riêng của mình, bởi bạn là một vì sao độc nhất vô nhị."'
    },
    friend: {
      title: 'Gửi Người Bạn / Đồng Nghiệp Tuyệt Vời,',
      p1: 'Chúc bạn một ngày 20/10 thật nhiều hoa, nhiều quà và tràn đầy năng lượng tích cực! Chúc mọi ước mơ và dự định của bạn đều sớm thành hiện thực.',
      p2: 'Cảm ơn bạn vì luôn là người đồng hành đáng tin cậy và mang lại nhiều niềm vui cho mọi người xung quanh.',
      quote: '"Chúc bạn luôn rực rỡ, độc lập và hạnh phúc trọn vẹn trên từng bước đường tương lai."'
    }
  };

  // --------------------------------------------------------------------------
  // Web Audio Romantic Sound Engine
  // --------------------------------------------------------------------------
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingMusic = false;
      this.musicTimer = null;
      this.currentChord = 0;
      
      // Romantic Chord Progression (Fmaj9 -> Am7 -> Bbmaj9 -> C7sus4)
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

        // Play gentle arpeggio notes
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

    // Sound FX: Envelope Opening Swoosh & Chime
    playEnvelopeOpen() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        this.playNote(f, now + i * 0.08, 1.4, 0.1);
      });
    }

    // Sound FX: Shimmering Particle Burst
    playDissolveBurst() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((f, i) => {
        this.playNote(f, now + i * 0.06, 2.0, 0.08);
      });
    }

    // Sound FX: Heartbeat Thump (Low Frequency Double Pulse)
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

    // Sound FX: Bell Chime for Interactive Click
    playBellClick() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [1046.50, 1318.51, 1567.98];
      const pick = freqs[Math.floor(Math.random() * freqs.length)];
      this.playNote(pick, now, 0.8, 0.06);
    }
  }

  const audio = new RomanticAudioEngine();

  // --------------------------------------------------------------------------
  // Three.js Scene Setup
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('webgl-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07020d, 0.018);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(CONFIG.cameraStartPos.x, CONFIG.cameraStartPos.y, CONFIG.cameraStartPos.z);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true // For screenshot capture
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // OrbitControls for 3D navigation
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 65;
  controls.minDistance = 10;
  controls.maxPolarAngle = Math.PI / 2 + 0.2; // Don't go completely below horizon
  controls.enabled = false; // Enabled after envelope opens into 3D tree

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffe6f2, 1.2);
  scene.add(ambientLight);

  const pinkPointLight = new THREE.PointLight(0xff2a8d, 2.5, 50);
  pinkPointLight.position.set(0, 4, 10);
  scene.add(pinkPointLight);

  const warmGoldLight = new THREE.PointLight(0xfcd34d, 1.8, 40);
  warmGoldLight.position.set(0, -5, 5);
  scene.add(warmGoldLight);

  // --------------------------------------------------------------------------
  // Procedural Glowing Particle Texture
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

  // --------------------------------------------------------------------------
  // Background Starfield & Floating Embers
  // --------------------------------------------------------------------------
  function createStarfield() {
    const starCount = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const isPink = Math.random() > 0.6;
      col[i * 3] = isPink ? 1.0 : 0.85;
      col[i * 3 + 1] = isPink ? 0.45 : 0.9;
      col[i * 3 + 2] = isPink ? 0.8 : 1.0;
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

  // --------------------------------------------------------------------------
  // 3D Floating Envelope Model
  // --------------------------------------------------------------------------
  let envelopeGroup = new THREE.Group();
  let flapPivot = new THREE.Group();
  let letterPaperMesh = null;
  let envelopeFlapMesh = null;
  let waxSealMesh = null;

  function createEnvelope() {
    envelopeGroup = new THREE.Group();

    // Dimensions
    const width = 8.5;
    const height = 5.6;
    const depth = 0.3;

    // Materials
    const envelopeMat = new THREE.MeshStandardMaterial({
      color: 0xffe8f2,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const envelopeBackMat = new THREE.MeshStandardMaterial({
      color: 0xffd4e6,
      roughness: 0.4,
      metalness: 0.2
    });

    // 1. Envelope Back Plate
    const backGeo = new THREE.BoxGeometry(width, height, 0.08);
    const backMesh = new THREE.Mesh(backGeo, envelopeBackMat);
    envelopeGroup.add(backMesh);

    // 2. Envelope Front Pocket (Lower half)
    const pocketShape = new THREE.Shape();
    pocketShape.moveTo(-width / 2, -height / 2);
    pocketShape.lineTo(width / 2, -height / 2);
    pocketShape.lineTo(width / 2, 0.4);
    pocketShape.lineTo(0, -1.2);
    pocketShape.lineTo(-width / 2, 0.4);
    pocketShape.closePath();

    const pocketGeo = new THREE.ShapeGeometry(pocketShape);
    const pocketMesh = new THREE.Mesh(pocketGeo, envelopeMat);
    pocketMesh.position.z = depth / 2;
    envelopeGroup.add(pocketMesh);

    // 3. Side Triangles
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-width / 2, -height / 2);
    leftShape.lineTo(-width / 2, height / 2);
    leftShape.lineTo(0, -1.2);
    leftShape.closePath();
    const leftMesh = new THREE.Mesh(new THREE.ShapeGeometry(leftShape), envelopeMat);
    leftMesh.position.z = depth / 3;
    envelopeGroup.add(leftMesh);

    const rightShape = new THREE.Shape();
    rightShape.moveTo(width / 2, -height / 2);
    rightShape.lineTo(width / 2, height / 2);
    rightShape.lineTo(0, -1.2);
    rightShape.closePath();
    const rightMesh = new THREE.Mesh(new THREE.ShapeGeometry(rightShape), envelopeMat);
    rightMesh.position.z = depth / 3;
    envelopeGroup.add(rightMesh);

    // 4. Letter Paper Inside
    const letterGeo = new THREE.PlaneGeometry(width * 0.88, height * 1.1);
    const letterMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    letterPaperMesh = new THREE.Mesh(letterGeo, letterMat);
    letterPaperMesh.position.set(0, 0, 0.05);
    envelopeGroup.add(letterPaperMesh);

    // 5. Envelope Top Flap (Hinged at top seam)
    flapPivot.position.set(0, height / 2, depth / 2);
    
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-width / 2, 0);
    flapShape.lineTo(width / 2, 0);
    flapShape.lineTo(0, -height * 0.72);
    flapShape.closePath();

    const flapGeo = new THREE.ShapeGeometry(flapShape);
    envelopeFlapMesh = new THREE.Mesh(flapGeo, envelopeMat);
    flapPivot.add(envelopeFlapMesh);
    envelopeGroup.add(flapPivot);

    // 6. Golden Wax Seal with "20/10"
    const sealGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });
    waxSealMesh = new THREE.Mesh(sealGeo, sealMat);
    waxSealMesh.rotation.x = Math.PI / 2;
    waxSealMesh.position.set(0, -height * 0.72 + 0.3, 0.12);
    flapPivot.add(waxSealMesh);

    // 7. Floating Orbiting Hearts around Envelope
    const haloHeartCount = 12;
    const haloGroup = new THREE.Group();
    for (let i = 0; i < haloHeartCount; i++) {
      const miniGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const miniMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff2a8d : 0xfcd34d,
        transparent: true,
        opacity: 0.85
      });
      const mini = new THREE.Mesh(miniGeo, miniMat);
      const angle = (i / haloHeartCount) * Math.PI * 2;
      const radius = 5.8;
      mini.position.set(Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.6), (Math.random() - 0.5) * 3);
      mini.userData = { angle, radius, speed: 0.015 + Math.random() * 0.01 };
      haloGroup.add(mini);
    }
    envelopeGroup.add(haloGroup);
    envelopeGroup.userData.haloGroup = haloGroup;

    envelopeGroup.position.set(0, 0, 0);
    scene.add(envelopeGroup);
  }

  createEnvelope();

  // --------------------------------------------------------------------------
  // The Particle System: 28,000 Points (Heart & 3D Tree)
  // --------------------------------------------------------------------------
  let particleGeo = new THREE.BufferGeometry();
  let particleMat = null;
  let particleSystem = null;

  // Float32Arrays for GPU Attributes
  const positions = new Float32Array(CONFIG.particleCount * 3);
  const colors = new Float32Array(CONFIG.particleCount * 3);
  const targetPositions = new Float32Array(CONFIG.particleCount * 3);
  const targetColors = new Float32Array(CONFIG.particleCount * 3);
  const currentVelocities = new Float32Array(CONFIG.particleCount * 3);

  // Pre-calculated Target Coordinate Arrays
  const coordsHeart = new Float32Array(CONFIG.particleCount * 3);
  const colorsHeart = new Float32Array(CONFIG.particleCount * 3);
  const coordsTree = new Float32Array(CONFIG.particleCount * 3);
  const colorsTree = new Float32Array(CONFIG.particleCount * 3);
  const coordsLetter = new Float32Array(CONFIG.particleCount * 3);

  // Metadata for dynamic animations
  const particleMeta = [];

  function generateParticleTargets() {
    const count = CONFIG.particleCount;
    const currentPal = PALETTES[STATE.colorTheme];

    // 1. Initial Letter Sheet Target Coordinates
    // Spans the rectangular area of the letter (width ~7.5, height ~9.0)
    for (let i = 0; i < count; i++) {
      const lx = (Math.random() - 0.5) * 7.6;
      const ly = (Math.random() - 0.5) * 8.8 + 2.0;
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

      currentVelocities[i * 3] = 0;
      currentVelocities[i * 3 + 1] = 0;
      currentVelocities[i * 3 + 2] = 0;
    }

    // 2. Radiant Particle Heart (Matches User's Reference Image!)
    // Inner dense glowing heart outline + outer glittering nebula/aura
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      let x, y, z;
      const pColor = new THREE.Color();
      const randType = Math.random();

      if (randType < 0.45) {
        // [Cluster A: Dense Heart Boundary]
        // Very bright, sharply defined contour
        const s = CONFIG.baseHeartScale;
        const scatter = (Math.random() - 0.5) * 0.4;
        x = hx * s + scatter;
        y = hy * s + scatter + 2.2;
        z = (Math.random() - 0.5) * 1.6;

        // Hot pink to pure sparkling white
        if (Math.random() > 0.6) {
          pColor.copy(currentPal.accent);
        } else {
          pColor.copy(currentPal.primary);
        }
      } else if (randType < 0.80) {
        // [Cluster B: Outer Glittering Stardust Aura / Halo]
        // Ethereal dispersion expanding outward with soft noise
        const auraFactor = 1.05 + Math.random() * 0.45;
        const s = CONFIG.baseHeartScale * auraFactor;
        const scatter = (Math.random() - 0.5) * 1.8;
        x = hx * s + scatter;
        y = hy * s + scatter + 2.2;
        z = (Math.random() - 0.5) * 4.5;

        // Magenta / Violet / Secondary Pink
        pColor.copy(currentPal.secondary);
        if (Math.random() > 0.5) pColor.lerp(currentPal.halo, 0.6);
      } else {
        // [Cluster C: Inner Heart Dusting]
        // Soft mist inside the heart boundary
        const innerFactor = 0.15 + Math.random() * 0.78;
        const s = CONFIG.baseHeartScale * innerFactor;
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

    // 3. 3D Wishing Tree (Cây Tình Yêu & Ước Nguyện)
    // Trunk, Roots, 3D Branching Limbs, and Blossom Cloud Clusters
    const trunkCount = Math.floor(count * 0.18);
    const branchCount = Math.floor(count * 0.22);
    const blossomCount = count - trunkCount - branchCount;

    // A. Trunk & Roots
    for (let i = 0; i < trunkCount; i++) {
      const u = i / trunkCount;
      const y = -12 + u * 12; // From y = -12 to y = 0
      
      // Radius expands at base (root flare)
      const baseFlare = y < -9 ? Math.pow((-9 - y) / 3, 1.8) * 1.8 : 0;
      const r = (1.4 - u * 0.6) + baseFlare + (Math.random() - 0.5) * 0.3;
      const angle = u * Math.PI * 6 + Math.random() * Math.PI * 2;

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      coordsTree[i * 3] = x;
      coordsTree[i * 3 + 1] = y;
      coordsTree[i * 3 + 2] = z;

      const tColor = new THREE.Color(currentPal.trunk);
      tColor.lerp(currentPal.primary, u * 0.35); // Branches take on rose-gold glow
      colorsTree[i * 3] = tColor.r;
      colorsTree[i * 3 + 1] = tColor.g;
      colorsTree[i * 3 + 2] = tColor.b;

      particleMeta[i] = { type: 'trunk', origY: y, angle };
    }

    // B. Major 3D Branches
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
      const bIdx = i % branchNodes.length;
      const node = branchNodes[bIdx];
      const prog = Math.random();

      // Branch curve with gravity drop/arch
      const dist = prog * node.len;
      const arch = Math.sin(prog * Math.PI) * 1.5;
      const bx = node.start.x + node.dir.x * dist + (Math.random() - 0.5) * 0.8;
      const by = node.start.y + node.dir.y * dist + arch + (Math.random() - 0.5) * 0.8;
      const bz = node.start.z + node.dir.z * dist + (Math.random() - 0.5) * 0.8;

      coordsTree[idx * 3] = bx;
      coordsTree[idx * 3 + 1] = by;
      coordsTree[idx * 3 + 2] = bz;

      const bColor = new THREE.Color(currentPal.trunk).lerp(currentPal.blossom, prog * 0.8);
      colorsTree[idx * 3] = bColor.r;
      colorsTree[idx * 3 + 1] = bColor.g;
      colorsTree[idx * 3 + 2] = bColor.b;

      particleMeta[idx] = { type: 'branch', origY: by, bIdx };
    }

    // C. Canopy / Blossom Clusters (Billowing Heart-shaped Canopy)
    for (let i = 0; i < blossomCount; i++) {
      const idx = trunkCount + branchCount + i;
      
      // Cluster center: either at one of the branch tips or in the upper canopy heart dome
      let cx, cy, cz;
      if (Math.random() < 0.35) {
        // Clustered near branch ends
        const b = branchNodes[i % branchNodes.length];
        cx = b.start.x + b.dir.x * b.len;
        cy = b.start.y + b.dir.y * b.len + 1.2;
        cz = b.start.z + b.dir.z * b.len;
      } else {
        // Canopy crown forming an umbrella / heart-shaped cloud
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.6; // Upper hemisphere
        const radius = 3.5 + Math.random() * 8.5;
        cx = Math.sin(phi) * Math.cos(theta) * radius;
        cy = 5.5 + Math.cos(phi) * radius * 0.7;
        cz = Math.sin(phi) * Math.sin(theta) * radius;
      }

      // Cluster fluff / jitter
      const spread = 2.4;
      const fx = cx + (Math.random() - 0.5) * spread;
      const fy = cy + (Math.random() - 0.5) * spread;
      const fz = cz + (Math.random() - 0.5) * spread;

      coordsTree[idx * 3] = fx;
      coordsTree[idx * 3 + 1] = fy;
      coordsTree[idx * 3 + 2] = fz;

      // Color: Glowing Blossom Pink, Magenta, and Diamond Sparkle White
      const cColor = new THREE.Color();
      const randColor = Math.random();
      if (randColor < 0.5) {
        cColor.copy(currentPal.blossom);
      } else if (randColor < 0.85) {
        cColor.copy(currentPal.primary);
      } else {
        cColor.copy(currentPal.accent); // Sparkles
      }

      colorsTree[idx * 3] = cColor.r;
      colorsTree[idx * 3 + 1] = cColor.g;
      colorsTree[idx * 3 + 2] = cColor.b;

      // Check if this particle should be a drifting petal
      const isPetal = i < CONFIG.petalCount;
      particleMeta[idx] = {
        type: isPetal ? 'petal' : 'blossom',
        origX: fx,
        origY: fy,
        origZ: fz,
        driftSpeed: 0.04 + Math.random() * 0.05,
        swayPhase: Math.random() * Math.PI * 2
      };
    }

    // Set initial colors
    for (let i = 0; i < count * 3; i++) {
      colors[i] = colorsHeart[i];
      targetColors[i] = colorsHeart[i];
    }
  }

  generateParticleTargets();

  // Create Three.js Particle Cloud
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  particleMat = new THREE.PointsMaterial({
    size: 0.75,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.0 // Initially invisible while envelope is closed
  });

  particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // --------------------------------------------------------------------------
  // 3D Hanging Lanterns on Tree
  // --------------------------------------------------------------------------
  const lanternMeshes = [];

  function createHangingLanterns() {
    // Remove any existing lanterns
    lanternMeshes.forEach(l => scene.remove(l));
    lanternMeshes.length = 0;

    STATE.hangingWishes.forEach((item, index) => {
      const lanternGroup = new THREE.Group();

      // Golden hanging cord
      const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
      const cordMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
      const cord = new THREE.Mesh(cordGeo, cordMat);
      cord.position.y = 0.7;
      lanternGroup.add(cord);

      // Glowing Lantern Body (Crystal/Glass sphere with light inside)
      const bulbGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const bulbMat = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0xff2a8d : 0xfcd34d,
        transparent: true,
        opacity: 0.95
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      lanternGroup.add(bulb);

      // Ribbon / Paper Tag
      const tagGeo = new THREE.PlaneGeometry(0.6, 0.9);
      const tagMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        roughness: 0.4
      });
      const tag = new THREE.Mesh(tagGeo, tagMat);
      tag.position.y = -0.7;
      lanternGroup.add(tag);

      lanternGroup.position.copy(item.position);
      lanternGroup.userData = {
        wishData: item,
        index,
        initialY: item.position.y,
        bobPhase: Math.random() * Math.PI * 2
      };

      scene.add(lanternGroup);
      lanternMeshes.push(lanternGroup);
    });
  }

  // --------------------------------------------------------------------------
  // Interactive Fireworks / Click Sparks
  // --------------------------------------------------------------------------
  const sparkParticles = [];
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(300 * 3);
  const sparkColors = new Float32Array(300 * 3);
  const sparkVelocities = [];

  for (let i = 0; i < 300; i++) {
    sparkPositions[i * 3] = 0;
    sparkPositions[i * 3 + 1] = -100;
    sparkPositions[i * 3 + 2] = 0;
    sparkVelocities.push(new THREE.Vector3(0, 0, 0));
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

  const sparkMat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.9
  });

  const sparkMesh = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparkMesh);

  function triggerSparkBurst(worldPos) {
    audio.playBellClick();
    const currentPal = PALETTES[STATE.colorTheme];

    for (let i = 0; i < 300; i++) {
      sparkPositions[i * 3] = worldPos.x;
      sparkPositions[i * 3 + 1] = worldPos.y;
      sparkPositions[i * 3 + 2] = worldPos.z;

      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.15 + Math.random() * 0.35;

      sparkVelocities[i].set(
        Math.sin(phi) * Math.cos(angle) * speed,
        Math.sin(phi) * Math.sin(angle) * speed,
        Math.cos(phi) * speed
      );

      const color = Math.random() > 0.4 ? currentPal.primary : currentPal.accent;
      sparkColors[i * 3] = color.r;
      sparkColors[i * 3 + 1] = color.g;
      sparkColors[i * 3 + 2] = color.b;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;
  }

  // --------------------------------------------------------------------------
  // User Interaction Transitions (Phase 1 -> 2 -> 3 -> 4)
  // --------------------------------------------------------------------------
  const promptEl = document.getElementById('envelope-prompt');
  const letterModalEl = document.getElementById('letter-modal');
  const treeHudEl = document.getElementById('tree-hud');
  const btnDissolve = document.getElementById('btn-dissolve');

  // Open Envelope
  function openEnvelope() {
    if (STATE.phase !== 'ENVELOPE') return;
    STATE.phase = 'LETTER';

    audio.playEnvelopeOpen();
    if (!audio.isPlayingMusic) {
      audio.startAmbientMusic();
      const btnMusic = document.getElementById('btn-music');
      if (btnMusic) btnMusic.classList.add('playing');
    }
    promptEl.classList.remove('active');

    // 1. Animate Envelope Flap
    new TWEEN.Tween(flapPivot.rotation)
      .to({ x: -Math.PI * 0.92 }, 900)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // 2. Animate Wax Seal Fade/Scale
    new TWEEN.Tween(waxSealMesh.scale)
      .to({ x: 0.01, y: 0.01, z: 0.01 }, 500)
      .delay(300)
      .start();

    // 3. Slide letter out of envelope
    new TWEEN.Tween(letterPaperMesh.position)
      .to({ y: 4.8, z: 1.5 }, 1100)
      .delay(400)
      .easing(TWEEN.Easing.Back.Out)
      .onComplete(() => {
        // Reveal HTML Letter Modal with rich text and calligraphy
        letterModalEl.classList.remove('hidden');
      })
      .start();
  }

  // Click Envelope or Prompt
  promptEl.addEventListener('click', openEnvelope);

  // Dissolve Letter into Particles (The Core Highlight!)
  btnDissolve.addEventListener('click', () => {
    if (STATE.phase !== 'LETTER') return;
    STATE.phase = 'DISSOLVING';

    audio.playDissolveBurst();
    letterModalEl.classList.add('hidden');

    // 1. Fade out and remove envelope meshes
    new TWEEN.Tween(envelopeGroup.scale)
      .to({ x: 0.001, y: 0.001, z: 0.001 }, 700)
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => {
        envelopeGroup.visible = false;
      })
      .start();

    // 2. Fade in particle system
    particleMat.opacity = 1.0;

    // 3. Shockwave Scatter Burst: particles erupt outward from letter bounds
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.8;
      currentVelocities[i * 3] = Math.cos(angle) * speed;
      currentVelocities[i * 3 + 1] = Math.sin(angle) * speed;
      currentVelocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 2;
    }

    // 4. Smooth Camera Move Back to Frame the Giant Heart
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 1, z: 28 }, 1600)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // 5. Magnetically assemble particles into the Radiant Particle Heart
    setTimeout(() => {
      STATE.phase = 'HEART';
      for (let i = 0; i < CONFIG.particleCount; i++) {
        targetPositions[i * 3] = coordsHeart[i * 3];
        targetPositions[i * 3 + 1] = coordsHeart[i * 3 + 1];
        targetPositions[i * 3 + 2] = coordsHeart[i * 3 + 2];

        targetColors[i * 3] = colorsHeart[i * 3];
        targetColors[i * 3 + 1] = colorsHeart[i * 3 + 1];
        targetColors[i * 3 + 2] = colorsHeart[i * 3 + 2];
      }

      // Heartbeat pulse sound & visual waves
      setTimeout(() => audio.playHeartbeat(), 800);
      setTimeout(() => audio.playHeartbeat(), 2000);

      // Show toast
      showToast('💖 Trái tim yêu thương kết tinh từ từng hạt sáng...');

      // 6. After blooming as Heart, morph gracefully into the 3D Wishing Tree!
      setTimeout(() => {
        morphToTree();
      }, 4200);
    }, 900);
  });

  // Morph to 3D Wishing Tree
  function morphToTree() {
    STATE.phase = 'TREE';
    STATE.morphTarget = 'TREE';
    controls.enabled = true; // Enable 3D Orbiting

    showToast('🌳 Trái tim bung nở thành Cây Ước Nguyện 20-10 rực rỡ!');
    treeHudEl.classList.remove('hidden');

    document.getElementById('hud-title').innerHTML = '✨ Cây Ước Nguyện & Trái Tim Ánh Sáng ✨';
    document.getElementById('hud-subtitle').innerText = 'Xoay 360° để chiêm ngưỡng cây hoa ánh sáng và những lời chúc yêu thương';

    const btnToggle = document.getElementById('btn-toggle-shape');
    btnToggle.querySelector('.btn-label').innerText = 'Hình Dáng: Cây';
    btnToggle.querySelector('.btn-icon').innerText = '🌳';

    // Set Target to 3D Tree
    for (let i = 0; i < CONFIG.particleCount; i++) {
      targetPositions[i * 3] = coordsTree[i * 3];
      targetPositions[i * 3 + 1] = coordsTree[i * 3 + 1];
      targetPositions[i * 3 + 2] = coordsTree[i * 3 + 2];

      targetColors[i * 3] = colorsTree[i * 3];
      targetColors[i * 3 + 1] = colorsTree[i * 3 + 1];
      targetColors[i * 3 + 2] = colorsTree[i * 3 + 2];
    }

    // Camera move
    controls.target.set(0, 2, 0);
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 2, z: 32 }, 2000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // Show hanging lanterns
    lanternMeshes.forEach(l => l.visible = true);
    if (lanternMeshes.length === 0) {
      setTimeout(() => {
        createHangingLanterns();
      }, 1500);
    }
  }

  // Morph to Heart
  function morphToHeart() {
    STATE.morphTarget = 'HEART';
    showToast('💖 Hội tụ thành Trái Tim Ánh Sáng lung linh!');

    document.getElementById('hud-title').innerHTML = '💖 Trái Tim Ánh Sáng 20-10 💖';
    document.getElementById('hud-subtitle').innerText = 'Từng hạt sáng kết thành hình trái tim ấm áp dành riêng cho bạn';

    const btnToggle = document.getElementById('btn-toggle-shape');
    btnToggle.querySelector('.btn-label').innerText = 'Hình Dáng: Trái Tim';
    btnToggle.querySelector('.btn-icon').innerText = '💖';

    // Hide lanterns while in Heart shape
    lanternMeshes.forEach(l => l.visible = false);
    controls.target.set(0, 1.5, 0);

    for (let i = 0; i < CONFIG.particleCount; i++) {
      targetPositions[i * 3] = coordsHeart[i * 3];
      targetPositions[i * 3 + 1] = coordsHeart[i * 3 + 1];
      targetPositions[i * 3 + 2] = coordsHeart[i * 3 + 2];

      targetColors[i * 3] = colorsHeart[i * 3];
      targetColors[i * 3 + 1] = colorsHeart[i * 3 + 1];
      targetColors[i * 3 + 2] = colorsHeart[i * 3 + 2];
    }

    audio.playHeartbeat();
  }

  // --------------------------------------------------------------------------
  // Recipient Greeting Selector
  // --------------------------------------------------------------------------
  const tagButtons = document.querySelectorAll('.tag-btn');
  const recipientTitleEl = document.getElementById('letter-recipient-title');
  const p1El = document.getElementById('letter-paragraph-1');
  const p2El = document.getElementById('letter-paragraph-2');
  const customFormEl = document.getElementById('custom-wish-form');
  const customNameInput = document.getElementById('custom-name-input');
  const customMsgInput = document.getElementById('custom-message-input');
  const btnApplyCustom = document.getElementById('btn-apply-custom');

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.dataset.role;
      STATE.recipientRole = role;

      if (role === 'custom') {
        customFormEl.classList.remove('hidden');
      } else {
        customFormEl.classList.add('hidden');
        const data = GREETINGS[role];
        recipientTitleEl.innerText = data.title;
        p1El.innerText = data.p1;
        p2El.innerText = data.p2;
      }
    });
  });

  btnApplyCustom.addEventListener('click', () => {
    const name = customNameInput.value.trim() || 'Người Phụ Nữ Tuyệt Vời';
    const msg = customMsgInput.value.trim() || 'Chúc bạn một ngày 20/10 ngập tràn nụ cười, hạnh phúc và vạn sự như ý!';

    recipientTitleEl.innerText = `Thân Gửi ${name},`;
    p1El.innerText = msg;
    p2El.innerText = 'Cảm ơn bạn vì đã luôn là ánh sáng ấm áp và dịu dàng trong cuộc sống!';
    showToast('✨ Lời chúc tùy chỉnh đã được cập nhật!');
  });

  // --------------------------------------------------------------------------
  // HUD Buttons & Event Listeners
  // --------------------------------------------------------------------------
  // Shape Morph Toggle
  document.getElementById('btn-toggle-shape').addEventListener('click', () => {
    if (STATE.morphTarget === 'TREE') {
      morphToHeart();
    } else {
      morphToTree();
    }
  });

  // Reopen Letter
  document.getElementById('btn-reopen-letter').addEventListener('click', () => {
    letterModalEl.classList.remove('hidden');
  });

  // Replay from beginning
  document.getElementById('btn-replay').addEventListener('click', () => {
    treeHudEl.classList.add('hidden');
    letterModalEl.classList.add('hidden');
    controls.enabled = false;

    // Reset Camera
    camera.position.set(CONFIG.cameraStartPos.x, CONFIG.cameraStartPos.y, CONFIG.cameraStartPos.z);
    camera.lookAt(0, 0, 0);

    // Reset Envelope
    envelopeGroup.visible = true;
    envelopeGroup.scale.set(1, 1, 1);
    flapPivot.rotation.x = 0;
    waxSealMesh.scale.set(1, 1, 1);
    letterPaperMesh.position.set(0, 0, 0.05);

    // Hide Particles
    particleMat.opacity = 0.0;
    for (let i = 0; i < CONFIG.particleCount; i++) {
      positions[i * 3] = coordsLetter[i * 3];
      positions[i * 3 + 1] = coordsLetter[i * 3 + 1];
      positions[i * 3 + 2] = coordsLetter[i * 3 + 2];
      targetPositions[i * 3] = coordsLetter[i * 3];
      targetPositions[i * 3 + 1] = coordsLetter[i * 3 + 1];
      targetPositions[i * 3 + 2] = coordsLetter[i * 3 + 2];
    }
    particleGeo.attributes.position.needsUpdate = true;

    lanternMeshes.forEach(l => scene.remove(l));
    lanternMeshes.length = 0;

    STATE.phase = 'ENVELOPE';
    promptEl.classList.add('active');
    showToast('✨ Đã trở lại bao thư ban đầu.');
  });

  // Palette Menu Dropdown
  const btnPalette = document.getElementById('btn-palette');
  const paletteMenu = document.getElementById('palette-menu');
  btnPalette.addEventListener('click', (e) => {
    e.stopPropagation();
    paletteMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    paletteMenu.classList.add('hidden');
  });

  document.querySelectorAll('.palette-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.palette-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const theme = opt.dataset.theme;
      STATE.colorTheme = theme;
      generateParticleTargets();

      // If in heart, update target colors
      if (STATE.morphTarget === 'HEART') {
        for (let i = 0; i < CONFIG.particleCount; i++) {
          targetColors[i * 3] = colorsHeart[i * 3];
          targetColors[i * 3 + 1] = colorsHeart[i * 3 + 1];
          targetColors[i * 3 + 2] = colorsHeart[i * 3 + 2];
        }
      } else {
        for (let i = 0; i < CONFIG.particleCount; i++) {
          targetColors[i * 3] = colorsTree[i * 3];
          targetColors[i * 3 + 1] = colorsTree[i * 3 + 1];
          targetColors[i * 3 + 2] = colorsTree[i * 3 + 2];
        }
      }

      showToast(`🎨 Đã đổi sắc màu: ${PALETTES[theme].name}`);
    });
  });

  // Music Toggle
  const btnMusic = document.getElementById('btn-music');
  btnMusic.addEventListener('click', () => {
    const isPlaying = audio.toggleMusic();
    if (isPlaying) {
      btnMusic.classList.add('playing');
      showToast('🎵 Đang phát giai điệu lãng mạn...');
    } else {
      btnMusic.classList.remove('playing');
      showToast('🔇 Đã tạm dừng nhạc.');
    }
  });

  // Fullscreen Toggle
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Hang Wish Modal
  const hangWishModal = document.getElementById('hang-wish-modal');
  const btnHangWish = document.getElementById('btn-hang-wish');
  const btnCloseWishModal = document.getElementById('btn-close-wish-modal');
  const btnSubmitWish = document.getElementById('btn-submit-wish');
  const wishSenderInput = document.getElementById('wish-sender');
  const wishTextInput = document.getElementById('wish-text');

  btnHangWish.addEventListener('click', () => {
    hangWishModal.classList.remove('hidden');
  });

  btnCloseWishModal.addEventListener('click', () => {
    hangWishModal.classList.add('hidden');
  });

  btnSubmitWish.addEventListener('click', () => {
    const sender = wishSenderInput.value.trim() || 'Người gửi ẩn danh';
    const text = wishTextInput.value.trim();

    if (!text) {
      showToast('⚠️ Vui lòng nhập nội dung lời chúc!');
      return;
    }

    // Pick random branch coordinate for new lantern
    const angle = Math.random() * Math.PI * 2;
    const r = 3.5 + Math.random() * 5.0;
    const y = 4.5 + Math.random() * 6.0;
    const pos = new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);

    const newWish = { sender, text, position: pos };
    STATE.hangingWishes.push(newWish);
    createHangingLanterns();

    hangWishModal.classList.add('hidden');
    wishTextInput.value = '';
    showToast('✨ Lời chúc của bạn đã kết thành lồng đèn trên cây!');

    // Trigger celebratory sparks around the lantern position
    triggerSparkBurst(pos);
  });

  // Wish Reader Popup
  const readerCard = document.getElementById('wish-reader-card');
  const readerContent = document.getElementById('reader-content');
  const readerAuthor = document.getElementById('reader-author');
  const btnCloseReader = document.getElementById('btn-close-reader');

  btnCloseReader.addEventListener('click', () => {
    readerCard.classList.add('hidden');
  });

  // Screenshot / Souvenir Capture
  document.getElementById('btn-screenshot').addEventListener('click', () => {
    // Render current frame
    renderer.render(scene, camera);
    const dataUrl = canvas.toDataURL('image/png');

    // Create download link
    const link = document.createElement('a');
    link.download = '20-10-Mon-Qua-Dieu-Ky.png';
    link.href = dataUrl;
    link.click();

    showToast('📸 Đã lưu bức ảnh kỷ niệm 20-10 thành công!');
  });

  // Raycaster for clicking envelope or hanging lanterns
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    if (e.target !== canvas) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (STATE.phase === 'ENVELOPE') {
      openEnvelope();
      return;
    } else if (STATE.phase === 'TREE' || STATE.phase === 'HEART') {
      // Check click on hanging lanterns
      const lanternIntersects = raycaster.intersectObjects(lanternMeshes, true);
      if (lanternIntersects.length > 0) {
        let hitGroup = lanternIntersects[0].object;
        while (hitGroup.parent && !hitGroup.userData.wishData) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup.userData.wishData) {
          const w = hitGroup.userData.wishData;
          readerContent.innerText = `"${w.text}"`;
          readerAuthor.innerText = `— ${w.sender}`;
          readerCard.classList.remove('hidden');
          audio.playBellClick();
          return;
        }
      }

      // If clicked empty space, trigger love spark burst!
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      if (intersectionPoint) {
        triggerSparkBurst(intersectionPoint);
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown);

  // Toast Notification Helper
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast-message');
    toast.innerText = msg;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // Main Animation Loop
  // --------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    TWEEN.update();

    // 1. Envelope Floating & Halo Animation
    if (STATE.phase === 'ENVELOPE') {
      envelopeGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.35;
      envelopeGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.08;
      envelopeGroup.rotation.x = Math.cos(elapsedTime * 1.0) * 0.04;

      if (envelopeGroup.userData.haloGroup) {
        envelopeGroup.userData.haloGroup.children.forEach(mini => {
          mini.userData.angle += mini.userData.speed;
          mini.position.x = Math.cos(mini.userData.angle) * mini.userData.radius;
          mini.position.y = Math.sin(mini.userData.angle) * (mini.userData.radius * 0.6);
        });
      }
    }

    // 2. Starfield Slow Ambient Orbit
    starsMesh.rotation.y = elapsedTime * 0.015;
    starsMesh.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

    // 3. Particle System Physics & Morphing
    if (particleMat.opacity > 0) {
      const posArr = particleGeo.attributes.position.array;
      const colArr = particleGeo.attributes.color.array;
      const count = CONFIG.particleCount;

      // Heartbeat pulse calculation
      let heartScale = 1.0;
      if (STATE.morphTarget === 'HEART' || STATE.phase === 'HEART') {
        const beatCycle = elapsedTime % 1.25;
        if (beatCycle < 0.18) {
          heartScale = 1.0 + Math.sin((beatCycle / 0.18) * Math.PI) * 0.12;
        } else if (beatCycle > 0.28 && beatCycle < 0.44) {
          heartScale = 1.0 + Math.sin(((beatCycle - 0.28) / 0.16) * Math.PI) * 0.07;
        }
      }

      // Wind sway for tree
      const windSway = Math.sin(elapsedTime * 1.3) * 0.4;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;

        // Target with dynamic modulations
        let tx = targetPositions[idx];
        let ty = targetPositions[idx + 1];
        let tz = targetPositions[idx + 2];

        if (STATE.morphTarget === 'HEART') {
          tx *= heartScale;
          ty = (ty - 2.2) * heartScale + 2.2;
          tz *= heartScale;
        } else if (STATE.morphTarget === 'TREE') {
          const meta = particleMeta[i];
          if (meta) {
            if (meta.type === 'blossom' || meta.type === 'petal') {
              // Wind sway at canopy
              const heightFactor = Math.max(0, (ty + 10) / 20);
              tx += Math.sin(elapsedTime * 1.5 + ty * 0.3) * 0.25 * heightFactor;
              tz += Math.cos(elapsedTime * 1.2 + tx * 0.2) * 0.2 * heightFactor;

              // Falling petals loop
              if (meta.type === 'petal') {
                meta.origY -= meta.driftSpeed;
                meta.swayPhase += 0.04;
                tx = meta.origX + Math.sin(meta.swayPhase) * 1.2;
                ty = meta.origY;
                tz = meta.origZ + Math.cos(meta.swayPhase) * 0.8;

                // Reset petal to canopy top once it reaches ground
                if (meta.origY < -12.5) {
                  meta.origY = 7.0 + Math.random() * 6.0;
                  meta.origX = (Math.random() - 0.5) * 12;
                  meta.origZ = (Math.random() - 0.5) * 12;
                }
              }
            }
          }
        }

        // Spring / Easing Interpolation
        const ease = 0.055;
        posArr[idx] += (tx - posArr[idx]) * ease + currentVelocities[idx];
        posArr[idx + 1] += (ty - posArr[idx + 1]) * ease + currentVelocities[idx + 1];
        posArr[idx + 2] += (tz - posArr[idx + 2]) * ease + currentVelocities[idx + 2];

        // Dampen velocities
        currentVelocities[idx] *= 0.92;
        currentVelocities[idx + 1] *= 0.92;
        currentVelocities[idx + 2] *= 0.92;

        // Color smooth transition
        colArr[idx] += (targetColors[idx] - colArr[idx]) * 0.06;
        colArr[idx + 1] += (targetColors[idx + 1] - colArr[idx + 1]) * 0.06;
        colArr[idx + 2] += (targetColors[idx + 2] - colArr[idx + 2]) * 0.06;
      }

      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.color.needsUpdate = true;
    }

    // 4. Hanging Lanterns Gentle Bobbing & Wind
    lanternMeshes.forEach(l => {
      l.position.y = l.userData.initialY + Math.sin(elapsedTime * 1.8 + l.userData.bobPhase) * 0.15;
      l.rotation.z = Math.sin(elapsedTime * 1.4 + l.userData.bobPhase) * 0.08;
    });

    // 5. Update Sparks / Fireworks
    for (let i = 0; i < 300; i++) {
      sparkPositions[i * 3] += sparkVelocities[i].x;
      sparkPositions[i * 3 + 1] += sparkVelocities[i].y;
      sparkPositions[i * 3 + 2] += sparkVelocities[i].z;

      // Gravity and air drag
      sparkVelocities[i].y -= 0.006;
      sparkVelocities[i].multiplyScalar(0.96);
    }
    sparkGeo.attributes.position.needsUpdate = true;

    // Controls update
    if (controls.enabled) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  animate();

  // --------------------------------------------------------------------------
  // Resize Handler
  // --------------------------------------------------------------------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

})();
