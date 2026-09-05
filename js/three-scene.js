/**
 * BMW 3D WebGL Automotive Showroom 2.0 (Next-Level Overhaul)
 * Built with Three.js.
 * Features procedural M-Sport sports car, metallic shaders, volumetric laser headlight cones,
 * burnout tire smoke particle physics, thermal glowing brake discs, cinematic camera director,
 * dynamic day/midnight showroom atmosphere, and launch control camera punch.
 */

class BMWThreeScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error("Canvas element not found:", canvasId);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.carGroup = null;
    this.wheels = [];
    this.brakeRotors = [];
    this.paintMaterials = [];
    this.rimMaterials = [];
    this.caliperMaterials = [];
    this.rotorMaterials = [];
    this.headlightCones = [];
    
    // Particle systems
    this.windTunnelParticles = null;
    this.smokeParticles = null;
    this.smokeActive = false;
    this.smokeIntensity = 0;

    // Lights
    this.lights = {
      ambient: null,
      keySpot: null,
      blueRim: null,
      cyanFill: null,
      redAccent: null,
      overheadBox: null
    };
    this.currentAtmosphere = 'midnight'; // 'studio' or 'midnight'

    // Camera animation targets & choreography
    this.camCurrentPos = new THREE.Vector3(3.8, 1.4, 4.8);
    this.camTargetPos = new THREE.Vector3(3.8, 1.4, 4.8);
    this.lookCurrentTarget = new THREE.Vector3(0, 0.6, 0.2);
    this.lookTarget = new THREE.Vector3(0, 0.6, 0.2);
    this.cameraMode = 'scroll'; // 'scroll', 'preset', 'drone'
    this.droneAngle = 0;
    this.defaultFOV = 42;

    // Scroll & Interactivity state
    this.scrollProgress = 0;
    this.isTurntableMode = false;
    this.turntableRotation = 0;
    this.pointerDown = false;
    this.pointerPrevX = 0;
    this.userRotationVelocity = 0;
    this.wheelRotationSpeed = 0.05;
    this.brakeHeat = 0;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06070a, 0.038);

    // 2. Camera setup
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(this.defaultFOV, aspect, 0.1, 100);
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.lookCurrentTarget);

    // 3. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Studio Lighting System
    this.setupLighting();

    // 5. Showroom Floor, Runway & Reflective Halo
    this.buildShowroomFloor();

    // 6. 3D BMW M Sports Car Geometry
    this.buildCarModel();

    // 7. Volumetric Headlight Projection Cones
    this.buildVolumetricHeadlights();

    // 8. Particle FX (Wind Tunnel & Tire Burnout Smoke)
    this.buildWindTunnel();
    this.buildTireSmokeSystem();

    // 9. Controls & Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.setupPointerControls();

    // 10. Start Animation Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    this.lights.ambient = new THREE.AmbientLight(0x090d16, 1.6);
    this.scene.add(this.lights.ambient);

    // Key Spotlight (High crisp daylight)
    this.lights.keySpot = new THREE.SpotLight(0xffffff, 8.0, 30, Math.PI / 4, 0.35, 1);
    this.lights.keySpot.position.set(4, 7, 5);
    this.lights.keySpot.castShadow = true;
    this.lights.keySpot.shadow.mapSize.width = 2048;
    this.lights.keySpot.shadow.mapSize.height = 2048;
    this.lights.keySpot.shadow.bias = -0.0005;
    this.scene.add(this.lights.keySpot);

    // M-Blue Rim Light (Bavarian Accent)
    this.lights.blueRim = new THREE.DirectionalLight(0x0066b1, 5.5);
    this.lights.blueRim.position.set(-6, 3, -4);
    this.scene.add(this.lights.blueRim);

    // Cyan High-Tech Front Light
    this.lights.cyanFill = new THREE.DirectionalLight(0x00e5ff, 2.8);
    this.lights.cyanFill.position.set(5, 2, -3);
    this.scene.add(this.lights.cyanFill);

    // Rear M Red Accent Light
    this.lights.redAccent = new THREE.PointLight(0xe21a1a, 4.0, 14);
    this.lights.redAccent.position.set(0, 1.4, -5.5);
    this.scene.add(this.lights.redAccent);

    // Overhead Studio Softbox
    this.lights.overheadBox = new THREE.DirectionalLight(0xffffff, 1.4);
    this.lights.overheadBox.position.set(0, 8, 0);
    this.scene.add(this.lights.overheadBox);
  }

  buildShowroomFloor() {
    // Reflective Circular Podium
    const podiumGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.15, 64);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c12,
      metalness: 0.92,
      roughness: 0.12,
      flatShading: false
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.075;
    podium.receiveShadow = true;
    this.scene.add(podium);

    // Glowing Neon Halo Ring around podium
    const ringGeo = new THREE.RingGeometry(4.75, 4.88, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0066b1,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    this.scene.add(ring);

    // Ground Grid Runway
    const gridHelper = new THREE.GridHelper(50, 50, 0x002d62, 0x0e131d);
    gridHelper.position.y = -0.08;
    this.scene.add(gridHelper);

    // Soft Contact Shadow Plane under car
    const shadowGeo = new THREE.PlaneGeometry(3.6, 6.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.001;
    this.scene.add(shadowPlane);
  }

  buildCarModel() {
    this.carGroup = new THREE.Group();

    // 1. Iconic BMW Metallic Car Paint (MeshPhysicalMaterial)
    const carPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#002D62'), // Marina Bay Blue Metallic
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.98
    });
    this.paintMaterials.push(carPaintMat);

    // 2. High-Gloss Carbon Fiber / Shadowline Trim
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.32,
      metalness: 0.82
    });

    // 3. Dark Tinted Automotive Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x090f15,
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.55,
      transparent: true,
      opacity: 0.9
    });

    // 4. Chrome / Polished Exhaust & Grille Trim
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.98,
      roughness: 0.08
    });

    // 5. LED Laser DRL Headlights (Laser Cyan/White Glow)
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xe6fbff,
      emissive: 0x00e5ff,
      emissiveIntensity: 4.5,
      roughness: 0.05
    });

    // 6. LED M L-Shape Taillights (Vibrant Red)
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0x990000,
      emissive: 0xff1525,
      emissiveIntensity: 4.2,
      roughness: 0.1
    });

    // 7. Alloy Rim Material
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x2b303c,
      metalness: 0.92,
      roughness: 0.22
    });
    this.rimMaterials.push(rimMat);

    // 8. M Brake Caliper Material (Blue default)
    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      metalness: 0.72,
      roughness: 0.28
    });
    this.caliperMaterials.push(caliperMat);

    // 9. Tire Rubber Material
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.88,
      metalness: 0.12
    });

    // 10. Thermal Brake Rotor Material (Glows when hot)
    const rotorMat = new THREE.MeshStandardMaterial({
      color: 0x777777,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xff3300,
      emissiveIntensity: 0.0
    });
    this.rotorMaterials.push(rotorMat);

    // --- CAR CHASSIS & BODY GEOMETRY ---
    
    // Main Lower Body Shell (Aggressive Gran Coupé Stance)
    const lowerBodyGeo = new THREE.BoxGeometry(2.06, 0.48, 4.8);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, carPaintMat);
    lowerBody.position.y = 0.44;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    this.carGroup.add(lowerBody);

    // Aerodynamic Hood with Sculpted M Power Bulge
    const hoodGeo = new THREE.BoxGeometry(1.92, 0.22, 1.8);
    const hood = new THREE.Mesh(hoodGeo, carPaintMat);
    hood.position.set(0, 0.65, 0.95);
    hood.rotation.x = -0.06;
    hood.castShadow = true;
    this.carGroup.add(hood);

    // Center M Power Bulge Crease
    const bulgeGeo = new THREE.BoxGeometry(0.7, 0.08, 1.4);
    const bulge = new THREE.Mesh(bulgeGeo, carPaintMat);
    bulge.position.set(0, 0.76, 0.9);
    this.carGroup.add(bulge);

    // Front Bumper with Sculpted Air Intakes
    const frontBumperGeo = new THREE.BoxGeometry(2.06, 0.38, 0.6);
    const frontBumper = new THREE.Mesh(frontBumperGeo, carbonMat);
    frontBumper.position.set(0, 0.28, 2.35);
    this.carGroup.add(frontBumper);

    // Carbon Front Splitter
    const splitterGeo = new THREE.BoxGeometry(2.14, 0.05, 0.52);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, 0.12, 2.46);
    this.carGroup.add(splitter);

    // Iconic BMW Kidney Grille
    const grilleLeftGeo = new THREE.BoxGeometry(0.36, 0.32, 0.12);
    const grilleRightGeo = new THREE.BoxGeometry(0.36, 0.32, 0.12);
    const grilleLeft = new THREE.Mesh(grilleLeftGeo, carbonMat);
    const grilleRight = new THREE.Mesh(grilleRightGeo, carbonMat);
    grilleLeft.position.set(-0.24, 0.48, 2.42);
    grilleRight.position.set(0.24, 0.48, 2.42);
    this.carGroup.add(grilleLeft, grilleRight);

    // Grille Slats
    const slatMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
    [-0.24, 0.24].forEach(xCenter => {
      [-0.08, 0, 0.08].forEach(xOff => {
        const slatGeo = new THREE.BoxGeometry(0.02, 0.28, 0.14);
        const slat = new THREE.Mesh(slatGeo, slatMat);
        slat.position.set(xCenter + xOff, 0.48, 2.43);
        this.carGroup.add(slat);
      });
    });

    // BMW Roundel Emblem on Hood Tip
    const emblemGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24);
    const emblemMat = new THREE.MeshStandardMaterial({ color: 0x0066b1, metalness: 0.8, roughness: 0.2 });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.rotation.x = -0.15;
    emblem.position.set(0, 0.72, 2.05);
    this.carGroup.add(emblem);

    // Laser Headlights with Glowing Twin Elements
    [-0.78, 0.78].forEach(x => {
      const lightHousingGeo = new THREE.BoxGeometry(0.42, 0.15, 0.3);
      const lightHousing = new THREE.Mesh(lightHousingGeo, glassMat);
      lightHousing.position.set(x, 0.52, 2.3);
      lightHousing.rotation.y = (x > 0 ? -1 : 1) * 0.18;
      this.carGroup.add(lightHousing);

      const ledGeo = new THREE.BoxGeometry(0.34, 0.06, 0.08);
      const led = new THREE.Mesh(ledGeo, headlightMat);
      led.position.set(x, 0.52, 2.4);
      led.rotation.y = (x > 0 ? -1 : 1) * 0.18;
      this.carGroup.add(led);
    });

    // Cabin Greenhouse & Glasshouse
    const cabinGeo = new THREE.BoxGeometry(1.68, 0.58, 2.5);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 0.94, -0.2);
    cabin.castShadow = true;
    this.carGroup.add(cabin);

    // Carbon Fiber Aerodynamic Double-Bubble Roof
    const roofGeo = new THREE.BoxGeometry(1.58, 0.06, 2.1);
    const roof = new THREE.Mesh(roofGeo, carbonMat);
    roof.position.set(0, 1.24, -0.2);
    this.carGroup.add(roof);

    // Windshield (Front Raked)
    const windshieldGeo = new THREE.BoxGeometry(1.62, 0.05, 0.9);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 0.96, 0.75);
    windshield.rotation.x = -0.58;
    this.carGroup.add(windshield);

    // Rear Windshield (Fastback Angle)
    const rearGlassGeo = new THREE.BoxGeometry(1.58, 0.05, 1.0);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMat);
    rearGlass.position.set(0, 0.98, -1.25);
    rearGlass.rotation.x = 0.52;
    this.carGroup.add(rearGlass);

    // Side Aero M Stalk Mirrors
    [-0.98, 0.98].forEach(x => {
      const mirrorArmGeo = new THREE.BoxGeometry(0.12, 0.04, 0.06);
      const mirrorArm = new THREE.Mesh(mirrorArmGeo, carbonMat);
      mirrorArm.position.set(x > 0 ? 0.92 : -0.92, 0.86, 0.45);

      const mirrorCapGeo = new THREE.BoxGeometry(0.22, 0.12, 0.14);
      const mirrorCap = new THREE.Mesh(mirrorCapGeo, carPaintMat);
      mirrorCap.position.set(x, 0.88, 0.45);
      this.carGroup.add(mirrorArm, mirrorCap);
    });

    // Rear Bootlid & Active M Lip Spoiler
    const trunkGeo = new THREE.BoxGeometry(1.9, 0.32, 1.1);
    const trunk = new THREE.Mesh(trunkGeo, carPaintMat);
    trunk.position.set(0, 0.68, -1.9);
    trunk.rotation.x = 0.04;
    this.carGroup.add(trunk);

    const spoilerGeo = new THREE.BoxGeometry(1.78, 0.06, 0.22);
    const spoiler = new THREE.Mesh(spoilerGeo, carbonMat);
    spoiler.position.set(0, 0.84, -2.36);
    this.carGroup.add(spoiler);

    // Rear Diffuser with Quad Exhausts
    const diffuserGeo = new THREE.BoxGeometry(1.95, 0.35, 0.5);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuser.position.set(0, 0.26, -2.25);
    this.carGroup.add(diffuser);

    // Quad Stainless Steel Exhaust Tips
    [-0.68, -0.52, 0.52, 0.68].forEach(x => {
      const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.24, 16);
      const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(x, 0.22, -2.48);
      this.carGroup.add(exhaust);
    });

    // Rear Taillights (Sculpted BMW L-shape LED light tubes)
    [-0.78, 0.78].forEach(x => {
      const taillightGeo = new THREE.BoxGeometry(0.48, 0.12, 0.1);
      const taillight = new THREE.Mesh(taillightGeo, taillightMat);
      taillight.position.set(x, 0.62, -2.4);
      taillight.rotation.y = (x > 0 ? 1 : -1) * 0.12;
      this.carGroup.add(taillight);
    });

    // 4 ALLOY WHEELS & THERMAL BRAKES
    const wheelPositions = [
      { x: -0.98, y: 0.34, z: 1.45, isRear: false },
      { x: 0.98, y: 0.34, z: 1.45, isRear: false },
      { x: -0.98, y: 0.34, z: -1.45, isRear: true },
      { x: 0.98, y: 0.34, z: -1.45, isRear: true }
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Rotating Wheel Sub-Assembly
      const rotatingHub = new THREE.Group();

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 32);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      rotatingHub.add(tire);

      // Alloy Rim Hub
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.25, 24);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      rotatingHub.add(rim);

      // M-Spokes Pattern
      for (let s = 0; s < 5; s++) {
        const spokeGeo = new THREE.BoxGeometry(0.04, 0.48, 0.05);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.rotation.x = (s * Math.PI) / 5;
        rotatingHub.add(spoke);
      }

      // Brake Rotor Disc (Thermal Glowing)
      const rotorGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24);
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.rotation.z = Math.PI / 2;
      rotatingHub.add(rotor);
      this.brakeRotors.push(rotor);

      wheelGroup.add(rotatingHub);

      // Stationary M Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.1, 0.16, 0.08);
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0, 0.15, 0.08);
      wheelGroup.add(caliper);

      this.carGroup.add(wheelGroup);
      this.wheels.push({ hub: rotatingHub, isRear: pos.isRear, position: pos });
    });

    this.scene.add(this.carGroup);
  }

  buildVolumetricHeadlights() {
    [-0.78, 0.78].forEach(x => {
      // Volumetric conical beam
      const coneGeo = new THREE.CylinderGeometry(0.12, 1.4, 7.5, 32, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(x, 0.45, 5.8);
      cone.rotation.x = Math.PI / 2 + 0.08;
      cone.rotation.y = (x > 0 ? -1 : 1) * 0.04;
      
      this.scene.add(cone);
      this.headlightCones.push(cone);

      // Light projection splash on ground
      const splashGeo = new THREE.CircleGeometry(1.2, 24);
      const splashMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });
      const splash = new THREE.Mesh(splashGeo, splashMat);
      splash.rotation.x = -Math.PI / 2;
      splash.position.set(x * 1.3, -0.07, 8.5);
      this.scene.add(splash);
      this.headlightCones.push(splash);
    });
  }

  buildWindTunnel() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.8;
      positions[i * 3 + 1] = 0.2 + Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      velocities.push(0.09 + Math.random() * 0.07);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.038,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.windTunnelParticles = new THREE.Points(geometry, material);
    this.windTunnelParticles.velocities = velocities;
    this.scene.add(this.windTunnelParticles);
  }

  buildTireSmokeSystem() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const pData = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -10; // offscreen until emitted
      positions[i * 3 + 2] = 0;
      pData.push({
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 60 + Math.random() * 40
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xbbbbcc,
      size: 0.35,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending
    });

    this.smokeParticles = new THREE.Points(geometry, material);
    this.smokeParticles.pData = pData;
    this.scene.add(this.smokeParticles);
  }

  emitTireSmoke(intensity = 1.0) {
    if (!this.smokeParticles) return;
    this.smokeActive = true;
    this.smokeIntensity = intensity;

    const pos = this.smokeParticles.geometry.attributes.position.array;
    const pData = this.smokeParticles.pData;

    for (let i = 0; i < pData.length; i++) {
      if (pData[i].life <= 0 && Math.random() < 0.25 * intensity) {
        // Spawn at rear wheels
        const side = Math.random() > 0.5 ? 0.98 : -0.98;
        pos[i * 3] = side + (Math.random() - 0.5) * 0.3;
        pos[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        pos[i * 3 + 2] = -1.45 + (Math.random() - 0.5) * 0.4;

        pData[i].vx = (Math.random() - 0.5) * 0.04;
        pData[i].vy = 0.02 + Math.random() * 0.03 * intensity;
        pData[i].vz = -0.05 - Math.random() * 0.06;
        pData[i].life = pData[i].maxLife;
      }
    }
  }

  setBrakeHeat(intensity) {
    this.brakeHeat = Math.max(0, Math.min(1, intensity));
    this.rotorMaterials.forEach(m => {
      m.emissiveIntensity = this.brakeHeat * 2.8;
    });
  }

  setupPointerControls() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.pointerDown = true;
      this.pointerPrevX = e.clientX;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.pointerDown) return;
      const deltaX = e.clientX - this.pointerPrevX;
      this.pointerPrevX = e.clientX;
      this.userRotationVelocity = deltaX * 0.005;
      this.turntableRotation += this.userRotationVelocity;
    });

    window.addEventListener('pointerup', () => {
      this.pointerDown = false;
    });
  }

  setCarColor(hexColor) {
    const color = new THREE.Color(hexColor);
    this.paintMaterials.forEach(mat => {
      mat.color.copy(color);
      if (hexColor === '#22252a' || hexColor === '#d2d6dc') {
        mat.roughness = 0.42;
        mat.metalness = 0.5;
        mat.clearcoat = 0.2;
      } else {
        mat.roughness = 0.16;
        mat.metalness = 0.88;
        mat.clearcoat = 1.0;
      }
    });
  }

  setWheelFinish(rimHex, caliperHex) {
    if (rimHex) {
      const rimCol = new THREE.Color(rimHex);
      this.rimMaterials.forEach(m => m.color.copy(rimCol));
    }
    if (caliperHex) {
      const calCol = new THREE.Color(caliperHex);
      this.caliperMaterials.forEach(m => m.color.copy(calCol));
    }
  }

  setHeadlightsHigh(isHigh) {
    this.headlightCones.forEach((cone, idx) => {
      cone.material.opacity = isHigh ? 0.35 : 0.16;
      if (cone.geometry.type === 'CylinderGeometry') {
        cone.scale.set(isHigh ? 1.4 : 1.0, isHigh ? 1.3 : 1.0, isHigh ? 1.4 : 1.0);
      }
    });
  }

  setAtmosphereMode(mode) {
    this.currentAtmosphere = mode;
    if (mode === 'studio') {
      this.lights.ambient.intensity = 2.4;
      this.lights.keySpot.intensity = 11.0;
      this.lights.overheadBox.intensity = 2.5;
      this.scene.fog.density = 0.02;
    } else {
      // Midnight Stealth Mode
      this.lights.ambient.intensity = 1.4;
      this.lights.keySpot.intensity = 7.5;
      this.lights.overheadBox.intensity = 1.0;
      this.scene.fog.density = 0.04;
    }
  }

  setCameraPreset(name) {
    this.cameraMode = name === 'drone' ? 'drone' : 'preset';

    switch (name) {
      case 'front':
        this.camTargetPos.set(3.8, 1.3, 4.5);
        this.lookTarget.set(0, 0.6, 0.2);
        this.camera.fov = 42;
        break;
      case 'side':
        this.camTargetPos.set(5.5, 1.0, 0.0);
        this.lookTarget.set(0, 0.5, 0);
        this.camera.fov = 40;
        break;
      case 'cockpit':
        // Inside driver cockpit perspective
        this.camTargetPos.set(0.0, 1.05, 0.25);
        this.lookTarget.set(0.0, 0.95, 3.2);
        this.camera.fov = 65;
        break;
      case 'rear':
        this.camTargetPos.set(-3.2, 0.85, -4.6);
        this.lookTarget.set(0, 0.45, -0.8);
        this.camera.fov = 42;
        break;
      case 'drone':
        this.camera.fov = 46;
        break;
      default:
        this.cameraMode = 'scroll';
        break;
    }
    this.camera.updateProjectionMatrix();
  }

  triggerLaunchPunch() {
    // Camera jerk back simulation
    this.camCurrentPos.z += 1.2;
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();

    setTimeout(() => {
      this.camera.fov = this.defaultFOV;
      this.camera.updateProjectionMatrix();
    }, 450);
  }

  updateScroll(progress) {
    if (this.cameraMode !== 'scroll') return;
    this.scrollProgress = Math.max(0, Math.min(1, progress));

    if (this.scrollProgress < 0.22) {
      const t = this.scrollProgress / 0.22;
      this.camTargetPos.set(
        THREE.MathUtils.lerp(3.8, 4.4, t),
        THREE.MathUtils.lerp(1.4, 1.2, t),
        THREE.MathUtils.lerp(4.8, 3.5, t)
      );
      this.lookTarget.set(0, 0.6, 0.2);
      this.isTurntableMode = false;
    } else if (this.scrollProgress < 0.50) {
      const t = (this.scrollProgress - 0.22) / 0.28;
      this.camTargetPos.set(
        THREE.MathUtils.lerp(4.4, 5.4, t),
        THREE.MathUtils.lerp(1.2, 0.95, t),
        THREE.MathUtils.lerp(3.5, 0.2, t)
      );
      this.lookTarget.set(0, 0.5, 0);
      this.isTurntableMode = false;
    } else if (this.scrollProgress < 0.75) {
      const t = (this.scrollProgress - 0.50) / 0.25;
      this.camTargetPos.set(
        THREE.MathUtils.lerp(5.4, -3.2, t),
        THREE.MathUtils.lerp(0.95, 0.85, t),
        THREE.MathUtils.lerp(0.2, -4.5, t)
      );
      this.lookTarget.set(0, 0.45, -0.8);
      this.isTurntableMode = false;
    } else if (this.scrollProgress < 0.90) {
      const t = (this.scrollProgress - 0.75) / 0.15;
      this.camTargetPos.set(
        THREE.MathUtils.lerp(-3.2, 2.2, t),
        THREE.MathUtils.lerp(0.85, 4.2, t),
        THREE.MathUtils.lerp(-4.5, 2.6, t)
      );
      this.lookTarget.set(0, 0.4, 0);
      this.isTurntableMode = false;
    } else {
      this.isTurntableMode = true;
      this.camTargetPos.set(3.8, 1.5, 4.6);
      this.lookTarget.set(0, 0.5, 0);
    }
  }

  onWindowResize() {
    if (!this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 1. Drone Orbit Camera Mode
    if (this.cameraMode === 'drone') {
      this.droneAngle += 0.008;
      this.camTargetPos.x = Math.sin(this.droneAngle) * 5.2;
      this.camTargetPos.z = Math.cos(this.droneAngle) * 5.2;
      this.camTargetPos.y = 1.4 + Math.sin(this.droneAngle * 0.5) * 0.4;
      this.lookTarget.set(0, 0.55, 0);
    }

    // 2. Smooth Camera Interpolation (LERP)
    this.camCurrentPos.lerp(this.camTargetPos, 0.055);
    this.lookCurrentTarget.lerp(this.lookTarget, 0.055);
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.lookCurrentTarget);

    // 3. Car Rotation / Turntable handling
    if (this.carGroup) {
      if (this.isTurntableMode) {
        if (!this.pointerDown) {
          this.userRotationVelocity *= 0.95;
          this.turntableRotation += 0.003 + this.userRotationVelocity;
        }
        this.carGroup.rotation.y = this.turntableRotation;
      } else {
        this.carGroup.rotation.y = THREE.MathUtils.lerp(this.carGroup.rotation.y, 0, 0.05);
      }

      // Wheel rotation
      this.wheels.forEach(item => {
        item.hub.rotation.x += this.wheelRotationSpeed;
      });
    }

    // 4. Brake Rotor Cooling
    if (this.brakeHeat > 0) {
      this.setBrakeHeat(this.brakeHeat - 0.006);
    }

    // 5. Wind Tunnel Particle Flow
    if (this.windTunnelParticles) {
      const positions = this.windTunnelParticles.geometry.attributes.position.array;
      const vels = this.windTunnelParticles.velocities;
      for (let i = 0; i < vels.length; i++) {
        positions[i * 3 + 2] -= vels[i] * 1.5;
        if (positions[i * 3 + 2] < -6) {
          positions[i * 3 + 2] = 6;
          positions[i * 3] = (Math.random() - 0.5) * 2.8;
          positions[i * 3 + 1] = 0.2 + Math.random() * 1.5;
        }
      }
      this.windTunnelParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Burnout Tire Smoke Particles
    if (this.smokeParticles && this.smokeActive) {
      const positions = this.smokeParticles.geometry.attributes.position.array;
      const pData = this.smokeParticles.pData;
      let activeCount = 0;

      for (let i = 0; i < pData.length; i++) {
        if (pData[i].life > 0) {
          activeCount++;
          pData[i].life--;
          positions[i * 3] += pData[i].vx;
          positions[i * 3 + 1] += pData[i].vy;
          positions[i * 3 + 2] += pData[i].vz;
          if (pData[i].life <= 0) {
            positions[i * 3 + 1] = -10;
          }
        }
      }
      this.smokeParticles.geometry.attributes.position.needsUpdate = true;
      if (activeCount === 0) this.smokeActive = false;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.BMWThreeScene = BMWThreeScene;
