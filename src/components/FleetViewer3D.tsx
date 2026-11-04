import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RotateCw, Eye, Sliders, ChevronDown, ChevronUp, Play, Pause, Sparkles, Check } from 'lucide-react';

export const FleetViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePreset, setActivePreset] = useState<'geral' | 'plataforma' | 'cabine'>('geral');
  
  // Operation cycle progress: 0 to 100%
  // 0% - 35%: Phase 1 - Horizontal rollback (30-35% of deck length)
  // 35% - 100%: Phase 2 - Hydraulic tilt (basculamento) to ground
  const [cycleProgress, setCycleProgress] = useState(65);
  const [isRotating, setIsRotating] = useState(true);
  const [isAutoCycle, setIsAutoCycle] = useState(false);

  // References to keep animation loop & controls outside React re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // 3D Objects refs
  const platformPivotRef = useRef<THREE.Group | null>(null); // Tilting subframe
  const platformDeckRef = useRef<THREE.Group | null>(null);  // Sliding platform deck
  const pistonLRef = useRef<THREE.Group | null>(null);
  const pistonRRef = useRef<THREE.Group | null>(null);
  
  const requestRef = useRef<number>(0);
  const isRotatingRef = useRef(true);
  const isAutoCycleRef = useRef(false);
  const cycleProgressRef = useRef(65);
  const autoCycleDirRef = useRef<1 | -1>(1);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    isAutoCycleRef.current = isAutoCycle;
  }, [isAutoCycle]);

  useEffect(() => {
    cycleProgressRef.current = cycleProgress;
  }, [cycleProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize Renderer
    const width = container.clientWidth;
    const height = container.clientHeight || 540;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Scene & Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141416);
    scene.fog = new THREE.Fog(0x141416, 20, 60);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 6.5, 14);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 6;
    controls.maxDistance = 30;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // Studio Environment map via PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting: Warm key light + Cool Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xfff5ea, 0x1a202c, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(15, 20, 12);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 50;
      const d = 10;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb43034, 0.5);
    fillLight.position.set(-15, 8, -10);
    scene.add(fillLight);

    // Floor & Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111113,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Circular ground marker
    const ringGeo = new THREE.RingGeometry(5.2, 5.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb43034,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Contact shadow beneath truck
    const shadowGeo = new THREE.PlaneGeometry(13, 4.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-0.5, 0.02, 0);
    scene.add(shadow);

    // ==========================================
    // PROCEDURAL COMPOSITE TRUCK MODEL (THREE.Group)
    // Brand Red: 0xB43034 | Graphite: 0x222224 | Chrome: 0xe5e7eb
    // ==========================================
    const truckGroup = new THREE.Group();

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xb43034,
      roughness: 0.3,
      metalness: 0.15,
    });

    const whiteLiveryMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.35,
      metalness: 0.1,
    });

    const graphiteMaterial = new THREE.MeshStandardMaterial({
      color: 0x222224,
      roughness: 0.55,
      metalness: 0.45,
    });

    const darkSteel = new THREE.MeshStandardMaterial({
      color: 0x161618,
      roughness: 0.65,
      metalness: 0.8,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      roughness: 0.12,
      metalness: 0.95,
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });

    const rubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181a,
      roughness: 0.85,
      metalness: 0.05,
    });

    const beaconMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    // 1. CHASSIS RAILS (Longitudinal steel beams)
    const chassisGeo = new THREE.BoxGeometry(10.2, 0.35, 1.4);
    const chassis = new THREE.Mesh(chassisGeo, graphiteMaterial);
    chassis.position.set(0, 0.85, 0);
    chassis.castShadow = !isSoftwareGl;
    truckGroup.add(chassis);

    // Lateral fuel tanks & toolboxes
    const tankGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 16);
    const tankL = new THREE.Mesh(tankGeo, chromeMaterial);
    tankL.rotation.z = Math.PI / 2;
    tankL.position.set(-0.5, 0.65, 0.9);
    truckGroup.add(tankL);

    const toolboxGeo = new THREE.BoxGeometry(1.6, 0.5, 0.6);
    const toolboxR = new THREE.Mesh(toolboxGeo, darkSteel);
    toolboxR.position.set(-0.5, 0.65, -0.9);
    truckGroup.add(toolboxR);

    // 2. WHEELS & AXLES
    const wheelPositions = [
      { x: 3.4, z: 1.15, radius: 0.52, width: 0.36 },
      { x: 3.4, z: -1.15, radius: 0.52, width: 0.36 },
      { x: -2.2, z: 1.15, radius: 0.52, width: 0.42 },
      { x: -2.2, z: -1.15, radius: 0.52, width: 0.42 },
      { x: -3.5, z: 1.15, radius: 0.52, width: 0.42 },
      { x: -3.5, z: -1.15, radius: 0.52, width: 0.42 },
    ];

    wheelPositions.forEach((pos) => {
      const tireGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, pos.width, 24);
      const tire = new THREE.Mesh(tireGeo, rubberMaterial);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(pos.x, pos.radius, pos.z);
      tire.castShadow = !isSoftwareGl;

      const rimGeo = new THREE.CylinderGeometry(pos.radius * 0.55, pos.radius * 0.55, pos.width + 0.02, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMaterial);
      tire.add(rim);

      truckGroup.add(tire);
    });

    // 3. CABIN & BODY
    const cabGroup = new THREE.Group();
    cabGroup.position.set(3.0, 1.0, 0);

    const cabLowerGeo = new THREE.BoxGeometry(2.4, 1.2, 2.2);
    const cabLower = new THREE.Mesh(cabLowerGeo, whiteLiveryMaterial);
    cabLower.position.set(0, 0.6, 0);
    cabLower.castShadow = !isSoftwareGl;
    cabGroup.add(cabLower);

    const hoodGeo = new THREE.BoxGeometry(1.4, 0.9, 2.0);
    const hood = new THREE.Mesh(hoodGeo, redMaterial);
    hood.position.set(1.4, 0.45, 0);
    hood.castShadow = !isSoftwareGl;
    cabGroup.add(hood);

    const grilleGeo = new THREE.BoxGeometry(0.1, 0.7, 1.4);
    const grille = new THREE.Mesh(grilleGeo, darkSteel);
    grille.position.set(2.15, 0.45, 0);
    cabGroup.add(grille);

    const lightGeo = new THREE.BoxGeometry(0.12, 0.2, 0.35);
    const headL = new THREE.Mesh(lightGeo, chromeMaterial);
    headL.position.set(2.12, 0.35, 0.8);
    const headR = new THREE.Mesh(lightGeo, chromeMaterial);
    headR.position.set(2.12, 0.35, -0.8);
    cabGroup.add(headL);
    cabGroup.add(headR);

    const bumperGeo = new THREE.BoxGeometry(0.4, 0.35, 2.4);
    const bumper = new THREE.Mesh(bumperGeo, graphiteMaterial);
    bumper.position.set(2.2, 0.15, 0);
    cabGroup.add(bumper);

    const cabUpperGeo = new THREE.BoxGeometry(2.2, 1.1, 2.16);
    const cabUpper = new THREE.Mesh(cabUpperGeo, redMaterial);
    cabUpper.position.set(0, 1.7, 0);
    cabUpper.castShadow = !isSoftwareGl;
    cabGroup.add(cabUpper);

    const windshieldGeo = new THREE.BoxGeometry(0.1, 0.7, 1.9);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.position.set(1.12, 1.6, 0);
    windshield.rotation.z = -0.15;
    cabGroup.add(windshield);

    const sideWinGeo = new THREE.BoxGeometry(1.2, 0.55, 0.05);
    const winL = new THREE.Mesh(sideWinGeo, glassMaterial);
    winL.position.set(0.1, 1.65, 1.1);
    const winR = new THREE.Mesh(sideWinGeo, glassMaterial);
    winR.position.set(0.1, 1.65, -1.1);
    cabGroup.add(winL);
    cabGroup.add(winR);

    const visorGeo = new THREE.BoxGeometry(0.5, 0.12, 2.2);
    const visor = new THREE.Mesh(visorGeo, graphiteMaterial);
    visor.position.set(1.15, 2.15, 0);
    visor.rotation.z = 0.2;
    cabGroup.add(visor);

    const lightbarGeo = new THREE.BoxGeometry(0.3, 0.12, 1.4);
    const lightbar = new THREE.Mesh(lightbarGeo, beaconMaterial);
    lightbar.position.set(0.2, 2.32, 0);
    cabGroup.add(lightbar);

    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16);
    const exhaustL = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustL.position.set(-1.0, 2.2, 1.0);
    const exhaustR = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustR.position.set(-1.0, 2.2, -1.0);
    cabGroup.add(exhaustL);
    cabGroup.add(exhaustR);

    truckGroup.add(cabGroup);

    // 4. WINCH & HEADBOARD TOWER
    const pylonGeo = new THREE.BoxGeometry(0.35, 1.8, 2.3);
    const pylon = new THREE.Mesh(pylonGeo, graphiteMaterial);
    pylon.position.set(1.5, 1.9, 0);
    truckGroup.add(pylon);

    const drumGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.8, 16);
    const drum = new THREE.Mesh(drumGeo, darkSteel);
    drum.rotation.x = Math.PI / 2;
    drum.position.set(1.35, 1.6, 0);
    truckGroup.add(drum);

    // ==========================================
    // 5. HYDRAULIC TILTING & SLIDING SUBFRAME SYSTEM
    // ==========================================
    // PlatformPivot: Hinged at the rear chassis (-3.6, 1.1, 0) - tilts around Z
    const platformPivot = new THREE.Group();
    platformPivot.position.set(-3.6, 1.1, 0);

    // Subframe sliding guide rails (chassi intermediário)
    const subframeGeo = new THREE.BoxGeometry(6.6, 0.14, 1.6);
    const subframe = new THREE.Mesh(subframeGeo, graphiteMaterial);
    subframe.position.set(2.4, -0.06, 0);
    subframe.castShadow = !isSoftwareGl;
    platformPivot.add(subframe);

    // Central horizontal slide ram (pistão de deslocamento horizontal)
    const slideRamGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 16);
    const slideRam = new THREE.Mesh(slideRamGeo, chromeMaterial);
    slideRam.rotation.z = Math.PI / 2;
    slideRam.position.set(1.5, -0.04, 0);
    platformPivot.add(slideRam);

    // PlatformDeck: The actual flatbed that slides horizontally along subframe before tilting!
    // Total deck length = 7.6. 33% rollback distance = ~2.5m backward
    const platformDeck = new THREE.Group();
    platformDeck.position.set(3.6, 0, 0);

    // Main steel deck
    const deckGeo = new THREE.BoxGeometry(7.6, 0.2, 2.4);
    const deck = new THREE.Mesh(deckGeo, graphiteMaterial);
    deck.position.set(-1.0, 0.1, 0);
    deck.castShadow = !isSoftwareGl;
    deck.receiveShadow = !isSoftwareGl;
    platformDeck.add(deck);

    // Red outer edge rails
    const railGeo = new THREE.BoxGeometry(7.6, 0.18, 0.12);
    const railL = new THREE.Mesh(railGeo, redMaterial);
    railL.position.set(-1.0, 0.25, 1.22);
    const railR = new THREE.Mesh(railGeo, redMaterial);
    railR.position.set(-1.0, 0.25, -1.22);
    platformDeck.add(railL);
    platformDeck.add(railR);

    // Rear tapered beavertail ramp
    const rampGeo = new THREE.BoxGeometry(1.2, 0.12, 2.4);
    const ramp = new THREE.Mesh(rampGeo, darkSteel);
    ramp.position.set(-5.1, -0.02, 0);
    ramp.rotation.z = -0.12;
    platformDeck.add(ramp);

    platformPivot.add(platformDeck);
    truckGroup.add(platformPivot);

    platformPivotRef.current = platformPivot;
    platformDeckRef.current = platformDeck;

    // 6. HYDRAULIC LIFTING CYLINDERS (Twin telescopic rams on both sides of chassis)
    const hydraulicGroup = new THREE.Group();

    const cylOuterGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
    const cylInnerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);

    const pistonL = new THREE.Group();
    const sleeveL = new THREE.Mesh(cylOuterGeo, darkSteel);
    const rodL = new THREE.Mesh(cylInnerGeo, chromeMaterial);
    rodL.position.y = 0.2;
    pistonL.add(sleeveL);
    pistonL.add(rodL);

    const pistonR = new THREE.Group();
    const sleeveR = new THREE.Mesh(cylOuterGeo, darkSteel);
    const rodR = new THREE.Mesh(cylInnerGeo, chromeMaterial);
    rodR.position.y = 0.2;
    pistonR.add(sleeveR);
    pistonR.add(rodR);

    pistonL.position.z = 0.65;
    pistonR.position.z = -0.65;

    hydraulicGroup.add(pistonL);
    hydraulicGroup.add(pistonR);
    truckGroup.add(hydraulicGroup);

    pistonLRef.current = pistonL;
    pistonRRef.current = pistonR;

    // Rear underlift
    const underliftGeo = new THREE.BoxGeometry(1.6, 0.2, 1.8);
    const underlift = new THREE.Mesh(underliftGeo, graphiteMaterial);
    underlift.position.set(-4.6, 0.55, 0);
    truckGroup.add(underlift);

    scene.add(truckGroup);

    // Dynamic Animation Variables
    let currentSlide = 0;
    let currentTilt = 0;
    let lastTime = performance.now();
    let autoTimer = 0;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle Auto-Cycle Demonstration if active
      if (isAutoCycleRef.current) {
        autoTimer += delta;
        // Cycle completes in ~6 seconds
        const speed = 25 * autoCycleDirRef.current;
        let next = cycleProgressRef.current + speed * delta;
        if (next >= 100) {
          next = 100;
          if (autoTimer > 1.2) {
            autoCycleDirRef.current = -1;
            autoTimer = 0;
          }
        } else if (next <= 0) {
          next = 0;
          if (autoTimer > 1.2) {
            autoCycleDirRef.current = 1;
            autoTimer = 0;
          }
        }
        cycleProgressRef.current = next;
        setCycleProgress(Math.round(next));
      }

      // ==========================================
      // TWO-PHASE ROLLBACK & TILT MECHANICAL LOGIC
      // Phase 1 (0% - 35%): Horizontal slide backward (30-35% of deck length = 2.5m)
      // Phase 2 (35% - 100%): Hydraulic tilt (0° to 16°)
      // ==========================================
      const p = Math.max(0, Math.min(100, cycleProgressRef.current)) / 100;
      let targetSlide = 0;
      let targetTilt = 0;

      if (p <= 0.35) {
        // Phase 1: Pure horizontal slide backwards. Tilt is zero!
        const slideFraction = p / 0.35;
        targetSlide = slideFraction * 2.5; // Up to 33% of 7.6m deck length
        targetTilt = 0;
      } else {
        // Phase 2: Deck remains at full rear slide, subframe tilts!
        targetSlide = 2.5;
        const tiltFraction = (p - 0.35) / 0.65;
        targetTilt = tiltFraction * 16.0; // 0° to 16°
      }

      // Smooth damping
      currentSlide = THREE.MathUtils.damp(currentSlide, targetSlide, 6, delta);
      currentTilt = THREE.MathUtils.damp(currentTilt, targetTilt, 6, delta);

      // Apply horizontal slide to platformDeck along subframe
      if (platformDeckRef.current) {
        platformDeckRef.current.position.x = 3.6 - currentSlide;
      }

      // Apply tilt rotation around rear subframe hinge
      const rad = THREE.MathUtils.degToRad(currentTilt);
      if (platformPivotRef.current) {
        platformPivotRef.current.rotation.z = rad;
      }

      // Kinematic update of hydraulic lifting rams
      const baseX = -1.8;
      const baseY = 0.85;
      const R = 2.4; // Bracket point on tilting subframe
      const topX = -3.6 + R * Math.cos(rad);
      const topY = 1.1 + R * Math.sin(rad);
      const dx = topX - baseX;
      const dy = topY - baseY;
      const len = Math.hypot(dx, dy);
      const angleZ = -Math.atan2(dx, dy);

      if (pistonLRef.current) {
        pistonLRef.current.position.set((baseX + topX) / 2, (baseY + topY) / 2, 0.65);
        pistonLRef.current.scale.set(1, len, 1);
        pistonLRef.current.rotation.z = angleZ;
      }

      if (pistonRRef.current) {
        pistonRRef.current.position.set((baseX + topX) / 2, (baseY + topY) / 2, -0.65);
        pistonRRef.current.scale.set(1, len, 1);
        pistonRRef.current.rotation.z = angleZ;
      }

      // Slow showcase rotation
      if (isRotatingRef.current) {
        truckGroup.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Camera presets
  const setCameraPreset = (preset: 'geral' | 'plataforma' | 'cabine') => {
    setActivePreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    if (preset === 'geral') {
      cameraRef.current.position.set(12, 6.5, 14);
      controlsRef.current.target.set(0, 1.8, 0);
    } else if (preset === 'plataforma') {
      cameraRef.current.position.set(-11, 4.5, 7);
      controlsRef.current.target.set(-2, 1.4, 0);
    } else if (preset === 'cabine') {
      cameraRef.current.position.set(8, 3.5, 6);
      controlsRef.current.target.set(3, 2, 0);
    }
  };

  // Compute status description based on current cycle progress
  const getPhaseDescription = () => {
    if (cycleProgress === 0) {
      return {
        phase: 'Posição de Trânsito',
        detail: 'Rampa recolhida e travada no chassi',
        badge: '0% Plano',
      };
    }
    if (cycleProgress <= 35) {
      const slidePct = Math.round((cycleProgress / 35) * 33);
      return {
        phase: 'Fase 1: Recuo Horizontal',
        detail: `Deslocando para trás (~${slidePct}% do comprimento) sem inclinar`,
        badge: 'Recuo 33%',
      };
    }
    const tiltDegrees = Math.round(((cycleProgress - 35) / 65) * 16);
    return {
      phase: 'Fase 2: Basculamento Hidráulico',
      detail: `Rampa inclinando (${tiltDegrees}°) com extremidade tocando o solo`,
      badge: `${tiltDegrees}° Embarque`,
    };
  };

  const status = getPhaseDescription();

  return (
    <section id="modelo-3d" className="py-20 bg-[#141416] border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Simulação Mecânica Real</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              OPERAÇÃO DA PLATAFORMA: RECUO & BASCULAMENTO
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl">
              Ciclo real de funcionamento: primeiro a rampa desloca-se <strong>33% na horizontal para trás</strong> ao longo das guias, e somente após o recuo realiza o <strong>basculamento hidráulico</strong> para o embarque seguro do veículo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded">
              <Sparkles className="w-3.5 h-3.5 text-[#B43034]" />
              <span>Gire e inspecione em qualquer ângulo 3D</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3D Viewport Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[520px] sm:h-[620px] bg-[#111113] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
          
          {/* WebGL Canvas Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Minimal Top Badges */}
          <div className="absolute top-4 left-4 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="bg-neutral-900/90 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded border border-neutral-800 backdrop-blur-sm">
              Visualizador PBR Three.js
            </span>
            <span className="bg-red-950/90 text-red-300 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded border border-red-900/60 backdrop-blur-sm">
              {status.phase}: {status.badge}
            </span>
          </div>

          {/* Bottom Sleek Dock (Collapsible - Zero Viewport Occlusion) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-20 transition-all duration-300">
            
            {/* Collapse / Expand Toggle Button */}
            <div className="flex justify-center mb-1.5">
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="bg-neutral-900/95 hover:bg-neutral-850 text-neutral-300 hover:text-white text-xs font-semibold px-4 py-1.5 rounded-t-lg border-t border-x border-neutral-700/80 flex items-center gap-1.5 shadow-lg transition-colors"
                aria-label={isCollapsed ? 'Mostrar controles 3D' : 'Ocultar controles 3D'}
              >
                {isCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Exibir Controles de Operação</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ocultar Controles (Modo Amplo)</span>
                  </>
                )}
              </button>
            </div>

            {/* Dock Controls Body */}
            {!isCollapsed && (
              <div className="bg-neutral-900/95 border border-neutral-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-3">
                
                {/* Status Readout Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-950/80 px-3 py-2 rounded-lg border border-neutral-800/80 text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B43034]" />
                    <span className="font-bold text-white uppercase tracking-wider">{status.phase}</span>
                    <span className="text-neutral-400 hidden sm:inline">—</span>
                    <span className="text-neutral-300 text-[11px]">{status.detail}</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#B43034] bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50 self-start sm:self-auto">
                    {cycleProgress}% DO CICLO
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Slider: Two-Phase Operational Cycle */}
                  <div className="md:col-span-7 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-[#B43034]" />
                        <span>Ciclo de Operação:</span>
                      </span>
                      <span className="text-neutral-300 font-mono">
                        {cycleProgress <= 35 ? 'Fase 1: Recuo' : 'Fase 2: Basculamento'}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cycleProgress}
                      onChange={(e) => {
                        setIsAutoCycle(false);
                        setCycleProgress(Number(e.target.value));
                      }}
                      className="w-full accent-[#B43034] bg-neutral-800 h-2 rounded-lg cursor-pointer"
                      title="Controle do ciclo de operação (recuo horizontal e basculamento)"
                    />

                    {/* Step presets */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(0);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          cycleProgress === 0
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        0% Trânsito
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(35);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          cycleProgress === 35
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        35% Recuo Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(100);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          cycleProgress === 100
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        100% Embarque
                      </button>
                    </div>
                  </div>

                  {/* Actions & Presets */}
                  <div className="md:col-span-5 flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                    
                    {/* Camera view buttons */}
                    <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setCameraPreset('geral')}
                        className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                          activePreset === 'geral' ? 'bg-[#B43034] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Geral
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraPreset('plataforma')}
                        className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                          activePreset === 'plataforma' ? 'bg-[#B43034] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Rampa
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraPreset('cabine')}
                        className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                          activePreset === 'cabine' ? 'bg-[#B43034] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Cabine
                      </button>
                    </div>

                    {/* Auto Demonstration Cycle button */}
                    <button
                      type="button"
                      onClick={() => setIsAutoCycle(!isAutoCycle)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                        isAutoCycle
                          ? 'bg-[#B43034] border-[#B43034] text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
                      }`}
                      title={isAutoCycle ? 'Pausar demonstração' : 'Demonstrar ciclo completo'}
                    >
                      {isAutoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isAutoCycle ? 'Pausar' : 'Demonstrar'}</span>
                    </button>

                    {/* Rotation toggle */}
                    <button
                      type="button"
                      onClick={() => setIsRotating(!isRotating)}
                      className={`p-1.5 rounded border transition-colors ${
                        isRotating ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                      title={isRotating ? 'Pausar rotação' : 'Girar modelo'}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
