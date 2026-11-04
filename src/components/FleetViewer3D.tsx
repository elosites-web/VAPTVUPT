import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  RotateCw,
  Eye,
  Sliders,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
  Info,
  Truck,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { useTheme } from '../context/ThemeContext';

export type TruckModelType = 'guincho-leve' | 'cavalo-1635';

export const FleetViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Selected Truck Model State
  const [selectedModel, setSelectedModel] = useState<TruckModelType>('guincho-leve');
  const [activePreset, setActivePreset] = useState<'geral' | 'plataforma' | 'cabine'>('geral');
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // Platform operation cycle progress (0 to 100%) for Guincho Leve
  const [cycleProgress, setCycleProgress] = useState(65);
  const [isRotating, setIsRotating] = useState(true);
  const [isAutoCycle, setIsAutoCycle] = useState(false);

  // References for Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // 3D Objects refs
  const platformPivotRef = useRef<THREE.Group | null>(null);
  const platformDeckRef = useRef<THREE.Group | null>(null);
  const pistonLRef = useRef<THREE.Group | null>(null);
  const pistonRRef = useRef<THREE.Group | null>(null);

  // Two Truck Groups
  const guinchoGroupRef = useRef<THREE.Group | null>(null);
  const heavyTractorGroupRef = useRef<THREE.Group | null>(null);

  // Environment and Lighting refs for dynamic theme updates
  const floorMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const backWallMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const steelColumnMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);

  const requestRef = useRef<number>(0);
  const isRotatingRef = useRef(true);
  const isAutoCycleRef = useRef(false);
  const cycleProgressRef = useRef(65);
  const autoCycleDirRef = useRef<1 | -1>(1);
  const activePresetRef = useRef<'geral' | 'plataforma' | 'cabine'>('geral');
  const isInViewportRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);

  // Check and listen to prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const applyReducedMotion = (matches: boolean) => {
        prefersReducedMotionRef.current = matches;
        if (matches) {
          setIsRotating(false);
          setIsAutoCycle(false);
          isRotatingRef.current = false;
          isAutoCycleRef.current = false;
        }
      };
      applyReducedMotion(mql.matches);
      const handler = (e: MediaQueryListEvent) => applyReducedMotion(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, []);

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
    activePresetRef.current = activePreset;
  }, [activePreset]);

  // Synchronize 3D model visibility with selectedModel state
  useEffect(() => {
    if (guinchoGroupRef.current) {
      guinchoGroupRef.current.visible = selectedModel === 'guincho-leve';
    }
    if (heavyTractorGroupRef.current) {
      heavyTractorGroupRef.current.visible = selectedModel === 'cavalo-1635';
    }
  }, [selectedModel]);

  // Dynamic Theme Color Update in Three.js Environment
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const bgHex = isDarkMode ? 0x131316 : 0xf1f3f5;
    scene.background = new THREE.Color(bgHex);
    if (scene.fog) {
      scene.fog.color.setHex(bgHex);
    }

    if (floorMatRef.current) {
      floorMatRef.current.color.setHex(isDarkMode ? 0x202024 : 0xd5d9de);
    }
    if (backWallMatRef.current) {
      backWallMatRef.current.color.setHex(isDarkMode ? 0x141418 : 0xe3e7ec);
    }
    if (steelColumnMatRef.current) {
      steelColumnMatRef.current.color.setHex(isDarkMode ? 0x1e1e24 : 0x94a3b8);
    }

    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(isDarkMode ? 0xe4e7eb : 0xffffff);
      hemiLightRef.current.groundColor.setHex(isDarkMode ? 0x18181c : 0xcfd8dc);
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = isDarkMode ? 2.4 : 2.8;
    }
  }, [isDarkMode]);

  // Main Three.js Scene Setup with ResizeObserver
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability safely
    let gl: WebGL2RenderingContext | RenderingContext | null = null;
    try {
      const testCanvas = document.createElement('canvas');
      gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    } catch {
      gl = null;
    }

    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    let isSoftwareGl = false;
    try {
      const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
      const gpu = String((gl as WebGLRenderingContext).getParameter(param));
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      isSoftwareGl = false;
    }

    // Initialize Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch (e) {
      console.warn('WebGL Renderer initialization failed:', e);
      setWebGlSupported(false);
      return;
    }

    const isMobileDevice = window.innerWidth < 768;
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.25 : 1.75)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = isMobileDevice ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // ==========================================
    // INDUSTRIAL LOGISTICS SCENERY & HORIZON FOG
    // ==========================================
    const scene = new THREE.Scene();
    const initialBgHex = isDarkMode ? 0x131316 : 0xf1f3f5;
    scene.background = new THREE.Color(initialBgHex);
    scene.fog = new THREE.Fog(initialBgHex, 14, 54);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.enablePan = false;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controlsRef.current = controls;

    // Responsive Camera Calibrator
    const applyResponsiveCamera = (
      w: number,
      h: number,
      preset: 'geral' | 'plataforma' | 'cabine' = 'geral'
    ) => {
      if (!camera || !renderer) return;
      const currentAspect = w / h;
      camera.aspect = currentAspect;

      const zoomFactor = currentAspect < 1.25 ? Math.max(1.0, 1.35 / Math.max(currentAspect, 0.52)) : 1.0;

      if (preset === 'geral') {
        camera.position.set(12 * zoomFactor, 6.5 * (currentAspect < 1 ? 1.15 : 1.0), 14 * zoomFactor);
        controls.target.set(0, currentAspect < 1 ? 1.3 : 1.8, 0);
      } else if (preset === 'plataforma') {
        camera.position.set(-11 * zoomFactor, 4.5 * (currentAspect < 1 ? 1.15 : 1.0), 7 * zoomFactor);
        controls.target.set(-2, 1.4, 0);
      } else if (preset === 'cabine') {
        camera.position.set(8 * zoomFactor, 3.5 * (currentAspect < 1 ? 1.15 : 1.0), 6 * zoomFactor);
        controls.target.set(3, 1.9, 0);
      }

      controls.minDistance = currentAspect < 1 ? 8 : 6;
      controls.maxDistance = currentAspect < 1 ? 38 : 28;

      camera.updateProjectionMatrix();
      controls.update();
      renderer.setSize(w, h);
    };

    applyResponsiveCamera(width, height, 'geral');

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(
      isDarkMode ? 0xe4e7eb : 0xffffff,
      isDarkMode ? 0x18181c : 0xcfd8dc,
      0.9
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 2.4 : 2.8);
    keyLight.position.set(14, 18, 12);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      const shadowMapRes = isMobileDevice ? 512 : 1024;
      keyLight.shadow.mapSize.width = shadowMapRes;
      keyLight.shadow.mapSize.height = shadowMapRes;
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
    keyLightRef.current = keyLight;

    // Corporate red edge accent light (#B43034)
    const redAccentLight = new THREE.DirectionalLight(0xb43034, 1.25);
    redAccentLight.position.set(-14, 7, -9);
    scene.add(redAccentLight);

    // Front soft fill
    const fillLight = new THREE.DirectionalLight(0x71717a, 0.7);
    fillLight.position.set(6, 4, 14);
    scene.add(fillLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(120, 120);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x202024 : 0xd5d9de,
      roughness: 0.82,
      metalness: 0.12,
    });
    floorMatRef.current = floorMat;
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Logistics staging bay ring
    const ringGeo = new THREE.RingGeometry(6.4, 6.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb43034,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.012;
    scene.add(ring);

    // Contact shadow beneath vehicle
    const shadowGeo = new THREE.PlaneGeometry(14.0, 5.0);
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

    // Background Warehouse Columns and Beams
    const industrialGroup = new THREE.Group();
    const steelColumnMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e1e24 : 0x94a3b8,
      roughness: 0.6,
      metalness: 0.8,
    });
    steelColumnMatRef.current = steelColumnMat;

    [-14, -8, -2, 4, 10, 16].forEach((xPos) => {
      const colGeo = new THREE.BoxGeometry(0.5, 12, 0.5);
      const column = new THREE.Mesh(colGeo, steelColumnMat);
      column.position.set(xPos, 6, -14);
      industrialGroup.add(column);
    });

    const trussGeo = new THREE.BoxGeometry(34, 0.65, 0.7);
    const trussBeam = new THREE.Mesh(trussGeo, steelColumnMat);
    trussBeam.position.set(1, 10.5, -14);
    industrialGroup.add(trussBeam);

    const backWallGeo = new THREE.PlaneGeometry(60, 18);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x141418 : 0xe3e7ec,
      roughness: 0.95,
      metalness: 0.05,
    });
    backWallMatRef.current = backWallMat;
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 9, -20);
    industrialGroup.add(backWall);

    scene.add(industrialGroup);

    // Common Materials for Trucks
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb43034, roughness: 0.3, metalness: 0.15 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.35, metalness: 0.1 });
    const graphiteMat = new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.55, metalness: 0.45 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x161618, roughness: 0.65, metalness: 0.8 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.12, metalness: 0.95 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.85, metalness: 0.05 });
    const beaconMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6, roughness: 0.2 });

    // ========================================================
    // MODEL 1: GUINCHO LEVE PLATAFORMA (VW DELIVERY)
    // ========================================================
    const guinchoGroup = new THREE.Group();
    guinchoGroupRef.current = guinchoGroup;

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(10.2, 0.35, 1.4);
    const chassis = new THREE.Mesh(chassisGeo, graphiteMat);
    chassis.position.set(0, 0.85, 0);
    chassis.castShadow = !isSoftwareGl;
    guinchoGroup.add(chassis);

    // Tanks & toolbox
    const tankGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 16);
    const tankL = new THREE.Mesh(tankGeo, chromeMat);
    tankL.rotation.z = Math.PI / 2;
    tankL.position.set(-0.5, 0.65, 0.9);
    guinchoGroup.add(tankL);

    const toolboxGeo = new THREE.BoxGeometry(1.6, 0.5, 0.6);
    const toolboxR = new THREE.Mesh(toolboxGeo, darkSteelMat);
    toolboxR.position.set(-0.5, 0.65, -0.9);
    guinchoGroup.add(toolboxR);

    // Wheels (3 pairs)
    const wheelPositions1 = [
      { x: 3.4, z: 1.15, radius: 0.52, width: 0.36 },
      { x: 3.4, z: -1.15, radius: 0.52, width: 0.36 },
      { x: -2.2, z: 1.15, radius: 0.52, width: 0.42 },
      { x: -2.2, z: -1.15, radius: 0.52, width: 0.42 },
      { x: -3.5, z: 1.15, radius: 0.52, width: 0.42 },
      { x: -3.5, z: -1.15, radius: 0.52, width: 0.42 },
    ];
    wheelPositions1.forEach((pos) => {
      const tireGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, pos.width, 24);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(pos.x, pos.radius, pos.z);
      tire.castShadow = !isSoftwareGl;

      const rimGeo = new THREE.CylinderGeometry(pos.radius * 0.55, pos.radius * 0.55, pos.width + 0.02, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      tire.add(rim);
      guinchoGroup.add(tire);
    });

    // Cabin
    const cabGroup1 = new THREE.Group();
    cabGroup1.position.set(3.0, 1.0, 0);

    const cabLowerGeo = new THREE.BoxGeometry(2.4, 1.2, 2.2);
    const cabLower = new THREE.Mesh(cabLowerGeo, whiteMat);
    cabLower.position.set(0, 0.6, 0);
    cabLower.castShadow = !isSoftwareGl;
    cabGroup1.add(cabLower);

    const hoodGeo = new THREE.BoxGeometry(1.4, 0.9, 2.0);
    const hood = new THREE.Mesh(hoodGeo, redMat);
    hood.position.set(1.4, 0.45, 0);
    hood.castShadow = !isSoftwareGl;
    cabGroup1.add(hood);

    const grilleGeo = new THREE.BoxGeometry(0.1, 0.7, 1.4);
    const grille = new THREE.Mesh(grilleGeo, darkSteelMat);
    grille.position.set(2.11, 0.45, 0);
    cabGroup1.add(grille);

    const cabUpperGeo = new THREE.BoxGeometry(2.1, 1.1, 2.15);
    const cabUpper = new THREE.Mesh(cabUpperGeo, whiteMat);
    cabUpper.position.set(-0.1, 1.75, 0);
    cabUpper.castShadow = !isSoftwareGl;
    cabGroup1.add(cabUpper);

    // Windshield
    const windshieldGeo = new THREE.BoxGeometry(0.1, 0.85, 1.85);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0.96, 1.75, 0);
    windshield.rotation.z = -Math.PI / 20;
    cabGroup1.add(windshield);

    // Beacons bar
    const beaconBarGeo = new THREE.BoxGeometry(0.3, 0.12, 1.4);
    const beaconBar = new THREE.Mesh(beaconBarGeo, beaconMat);
    beaconBar.position.set(-0.1, 2.38, 0);
    cabGroup1.add(beaconBar);

    guinchoGroup.add(cabGroup1);

    // Tilting Subframe Pivot (Rear Hinge at X = -3.6, Y = 1.02)
    const platformPivot = new THREE.Group();
    platformPivot.position.set(-3.6, 1.02, 0);
    platformPivotRef.current = platformPivot;

    const subframeGroup = new THREE.Group();
    subframeGroup.position.set(3.6, -1.02, 0);

    const subframeRailGeo = new THREE.BoxGeometry(7.6, 0.22, 0.2);
    const railL = new THREE.Mesh(subframeRailGeo, darkSteelMat);
    railL.position.set(-0.1, 1.15, 0.75);
    subframeGroup.add(railL);

    const railR = new THREE.Mesh(subframeRailGeo, darkSteelMat);
    railR.position.set(-0.1, 1.15, -0.75);
    subframeGroup.add(railR);

    // Sliding Platform Deck (Base at X = 3.6 inside subframeGroup)
    const platformDeck = new THREE.Group();
    platformDeck.position.set(3.6, 0, 0);
    platformDeckRef.current = platformDeck;

    const deckGeo = new THREE.BoxGeometry(7.5, 0.16, 2.36);
    const deck = new THREE.Mesh(deckGeo, redMat);
    deck.position.set(-3.7, 1.35, 0);
    deck.castShadow = !isSoftwareGl;
    deck.receiveShadow = !isSoftwareGl;
    platformDeck.add(deck);

    // Headboard rack & winch
    const rackGeo = new THREE.BoxGeometry(0.2, 1.3, 2.34);
    const rack = new THREE.Mesh(rackGeo, darkSteelMat);
    rack.position.set(0.05, 2.05, 0);
    platformDeck.add(rack);

    const winchGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
    const winch = new THREE.Mesh(winchGeo, chromeMat);
    winch.rotation.x = Math.PI / 2;
    winch.position.set(0.05, 1.55, 0);
    platformDeck.add(winch);

    subframeGroup.add(platformDeck);
    platformPivot.add(subframeGroup);
    guinchoGroup.add(platformPivot);

    // Hydraulic Pistons
    const createPiston = () => {
      const g = new THREE.Group();
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 12), darkSteelMat);
      barrel.position.y = -0.25;
      g.add(barrel);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 12), chromeMat);
      rod.position.y = 0.25;
      g.add(rod);
      return g;
    };

    const pL = createPiston();
    pistonLRef.current = pL;
    guinchoGroup.add(pL);

    const pR = createPiston();
    pistonRRef.current = pR;
    guinchoGroup.add(pR);

    scene.add(guinchoGroup);

    // ========================================================
    // MODEL 2: CAVALO MECÂNICO 1635 (MERCEDES-BENZ PESADO)
    // ========================================================
    const heavyTractorGroup = new THREE.Group();
    heavyTractorGroupRef.current = heavyTractorGroup;

    // Heavy Tractor Chassis (Compact, rigid heavy steel 6x2 / 6x4)
    const heavyChassisGeo = new THREE.BoxGeometry(8.4, 0.45, 1.5);
    const heavyChassis = new THREE.Mesh(heavyChassisGeo, darkSteelMat);
    heavyChassis.position.set(-0.2, 0.95, 0);
    heavyTractorGroup.add(heavyChassis);

    // Heavy Front Bumper with Fog Lamps & Tow Hook
    const heavyBumperGeo = new THREE.BoxGeometry(0.55, 0.65, 2.45);
    const heavyBumper = new THREE.Mesh(heavyBumperGeo, darkSteelMat);
    heavyBumper.position.set(3.9, 0.75, 0);
    heavyTractorGroup.add(heavyBumper);

    // Chrome tow hook
    const hookGeo = new THREE.TorusGeometry(0.14, 0.04, 8, 16);
    const hook = new THREE.Mesh(hookGeo, chromeMat);
    hook.position.set(4.2, 0.6, 0);
    heavyTractorGroup.add(hook);

    // Mercedes 1635 Heavy Classic Cab
    const heavyCab = new THREE.Group();
    heavyCab.position.set(2.4, 1.15, 0);

    // Lower Cab with prominent front nose
    const mbLowerGeo = new THREE.BoxGeometry(2.6, 1.4, 2.3);
    const mbLower = new THREE.Mesh(mbLowerGeo, whiteMat);
    mbLower.position.set(0, 0.7, 0);
    mbLower.castShadow = !isSoftwareGl;
    heavyCab.add(mbLower);

    // Hood / Front Nose characteristic of 1635
    const mbHoodGeo = new THREE.BoxGeometry(1.5, 0.95, 2.1);
    const mbHood = new THREE.Mesh(mbHoodGeo, redMat);
    mbHood.position.set(1.4, 0.55, 0);
    mbHood.castShadow = !isSoftwareGl;
    heavyCab.add(mbHood);

    // Front Grille with silver star horizontal ribs
    const mbGrilleGeo = new THREE.BoxGeometry(0.1, 0.8, 1.6);
    const mbGrille = new THREE.Mesh(mbGrilleGeo, darkSteelMat);
    mbGrille.position.set(2.16, 0.55, 0);
    heavyCab.add(mbGrille);

    const starGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    const star = new THREE.Mesh(starGeo, chromeMat);
    star.rotation.z = Math.PI / 2;
    star.position.set(2.22, 0.65, 0);
    heavyCab.add(star);

    // Upper sleeper cab with rooftop aerodynamic deflector
    const mbUpperGeo = new THREE.BoxGeometry(2.3, 1.3, 2.25);
    const mbUpper = new THREE.Mesh(mbUpperGeo, whiteMat);
    mbUpper.position.set(-0.15, 2.05, 0);
    mbUpper.castShadow = !isSoftwareGl;
    heavyCab.add(mbUpper);

    // Windshield
    const mbWindshieldGeo = new THREE.BoxGeometry(0.1, 0.95, 2.0);
    const mbWindshield = new THREE.Mesh(mbWindshieldGeo, glassMat);
    mbWindshield.position.set(0.98, 2.05, 0);
    mbWindshield.rotation.z = -Math.PI / 22;
    heavyCab.add(mbWindshield);

    // Rooftop Aerofólio / Defletor
    const deflectorGeo = new THREE.BoxGeometry(1.6, 0.55, 2.2);
    const deflector = new THREE.Mesh(deflectorGeo, redMat);
    deflector.position.set(-0.25, 2.9, 0);
    deflector.rotation.z = Math.PI / 18;
    heavyCab.add(deflector);

    // Dual vertical exhaust stacks behind cab
    const exhaustGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8, 16);
    const exhaustL = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustL.position.set(-1.4, 2.4, 0.95);
    heavyCab.add(exhaustL);

    const exhaustR = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustR.position.set(-1.4, 2.4, -0.95);
    heavyCab.add(exhaustR);

    // Perforated heat guards
    const guardGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.8, 16, 1, true);
    const guardMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2, wireframe: true });
    const guardL = new THREE.Mesh(guardGeo, guardMat);
    guardL.position.set(-1.4, 2.0, 0.95);
    heavyCab.add(guardL);

    const guardR = new THREE.Mesh(guardGeo, guardMat);
    guardR.position.set(-1.4, 2.0, -0.95);
    heavyCab.add(guardR);

    // Spiral pneumatic air brake connector cables (Red and Yellow)
    const spiralGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
    const cableRed = new THREE.Mesh(spiralGeo, new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    cableRed.rotation.z = Math.PI / 3;
    cableRed.position.set(-1.6, 1.1, 0.25);
    heavyCab.add(cableRed);

    const cableYellow = new THREE.Mesh(spiralGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    cableYellow.rotation.z = Math.PI / 3;
    cableYellow.position.set(-1.6, 1.1, -0.25);
    heavyCab.add(cableYellow);

    heavyTractorGroup.add(heavyCab);

    // FIFTH WHEEL (Quinta Roda de Engate Pesada)
    const fifthWheelGroup = new THREE.Group();
    fifthWheelGroup.position.set(-1.8, 1.25, 0);

    const plateGeo = new THREE.CylinderGeometry(0.65, 0.72, 0.14, 24);
    const plate = new THREE.Mesh(plateGeo, darkSteelMat);
    plate.position.y = 0.07;
    fifthWheelGroup.add(plate);

    // Coupling slot
    const slotGeo = new THREE.BoxGeometry(0.7, 0.16, 0.22);
    const slot = new THREE.Mesh(slotGeo, chromeMat);
    slot.position.set(-0.2, 0.08, 0);
    fifthWheelGroup.add(slot);

    // Chassis base mount
    const mountGeo = new THREE.BoxGeometry(1.6, 0.2, 1.3);
    const mountPlate = new THREE.Mesh(mountGeo, graphiteMat);
    mountPlate.position.set(0, -0.05, 0);
    fifthWheelGroup.add(mountPlate);

    heavyTractorGroup.add(fifthWheelGroup);

    // Dual cylindrical diesel tanks (Both sides)
    const dieselTankGeo = new THREE.CylinderGeometry(0.42, 0.42, 2.4, 24);
    const tankLeft = new THREE.Mesh(dieselTankGeo, chromeMat);
    tankLeft.rotation.z = Math.PI / 2;
    tankLeft.position.set(0.3, 0.75, 1.05);
    heavyTractorGroup.add(tankLeft);

    const tankRight = new THREE.Mesh(dieselTankGeo, chromeMat);
    tankRight.rotation.z = Math.PI / 2;
    tankRight.position.set(0.3, 0.75, -1.05);
    heavyTractorGroup.add(tankRight);

    // Heavy Tandem Drive Wheels (Front steer + Dual rear tandem drive)
    const heavyWheelPositions = [
      { x: 2.8, z: 1.18, radius: 0.56, width: 0.38 },
      { x: 2.8, z: -1.18, radius: 0.56, width: 0.38 },
      // Rear axle 1 (dual wheels)
      { x: -1.2, z: 1.25, radius: 0.56, width: 0.46 },
      { x: -1.2, z: -1.25, radius: 0.56, width: 0.46 },
      // Rear axle 2 (dual wheels)
      { x: -2.5, z: 1.25, radius: 0.56, width: 0.46 },
      { x: -2.5, z: -1.25, radius: 0.56, width: 0.46 },
    ];

    heavyWheelPositions.forEach((pos) => {
      const tireGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, pos.width, 24);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(pos.x, pos.radius, pos.z);
      tire.castShadow = !isSoftwareGl;

      const rimGeo = new THREE.CylinderGeometry(pos.radius * 0.52, pos.radius * 0.52, pos.width + 0.02, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      tire.add(rim);
      heavyTractorGroup.add(tire);
    });

    // Start with model 2 hidden by default
    heavyTractorGroup.visible = false;
    scene.add(heavyTractorGroup);

    // ==========================================
    // ANIMATION LOOP & KINEMATICS (WITH VIEWPORT & TAB PAUSE)
    // ==========================================
    let lastTime = performance.now();
    let currentSlide = 0;
    let currentTilt = 0;
    let isLoopRunning = false;
    let lastReportedProgress = cycleProgressRef.current;

    const animate = (time: number) => {
      if (!isInViewportRef.current || !isTabVisibleRef.current) {
        isLoopRunning = false;
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto cycle bounce
      if (isAutoCycleRef.current && !prefersReducedMotionRef.current) {
        let nextP = cycleProgressRef.current + autoCycleDirRef.current * 18 * delta;
        if (nextP >= 100) {
          nextP = 100;
          autoCycleDirRef.current = -1;
        } else if (nextP <= 0) {
          nextP = 0;
          autoCycleDirRef.current = 1;
        }
        cycleProgressRef.current = nextP;
        const rounded = Math.round(nextP);
        if (rounded !== lastReportedProgress) {
          lastReportedProgress = rounded;
          setCycleProgress(rounded);
        }
      }

      // Hydraulic Platform Kinematics (Guincho Leve)
      const p = Math.max(0, Math.min(100, cycleProgressRef.current)) / 100;
      let targetSlide = 0;
      let targetTilt = 0;

      if (p <= 0.35) {
        const slideFraction = p / 0.35;
        targetSlide = slideFraction * 2.5;
        targetTilt = 0;
      } else {
        targetSlide = 2.5;
        const tiltFraction = (p - 0.35) / 0.65;
        targetTilt = tiltFraction * 16.0;
      }

      if (prefersReducedMotionRef.current) {
        currentSlide = targetSlide;
        currentTilt = targetTilt;
      } else {
        currentSlide = THREE.MathUtils.damp(currentSlide, targetSlide, 6, delta);
        currentTilt = THREE.MathUtils.damp(currentTilt, targetTilt, 6, delta);
      }

      if (platformDeckRef.current) {
        platformDeckRef.current.position.x = 3.6 - currentSlide;
      }
      const rad = THREE.MathUtils.degToRad(currentTilt);
      if (platformPivotRef.current) {
        platformPivotRef.current.rotation.z = rad;
      }

      const baseX = -1.8;
      const baseY = 0.85;
      const R = 2.4;
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

      // Slow 360° showcase rotation (applied to both trucks)
      if (isRotatingRef.current && !prefersReducedMotionRef.current) {
        if (guinchoGroupRef.current) guinchoGroupRef.current.rotation.y += 0.004;
        if (heavyTractorGroupRef.current) heavyTractorGroupRef.current.rotation.y += 0.004;
      }

      controls.update();
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    const startLoopIfEligible = () => {
      if (!isLoopRunning && isInViewportRef.current && isTabVisibleRef.current) {
        isLoopRunning = true;
        lastTime = performance.now();
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    startLoopIfEligible();

    // Pause rendering when viewer scrolls out of viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isInViewportRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            startLoopIfEligible();
          } else if (isLoopRunning) {
            cancelAnimationFrame(requestRef.current);
            isLoopRunning = false;
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Pause rendering when browser tab is inactive
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (isTabVisibleRef.current) {
        startLoopIfEligible();
      } else if (isLoopRunning) {
        cancelAnimationFrame(requestRef.current);
        isLoopRunning = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ==========================================
    // PROPER RESIZEOBSERVER IMPLEMENTATION
    // ==========================================
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          applyResponsiveCamera(w, h, activePresetRef.current);
          if (!isLoopRunning) {
            renderer.render(scene, camera);
          }
        }
      }
    });

    resizeObserver.observe(container);

    // Full Cleanup on Unmount
    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(requestRef.current);
      isLoopRunning = false;
      controls.dispose();

      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });

      if (scene.environment) {
        scene.environment.dispose();
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Camera presets
  const setCameraPreset = (preset: 'geral' | 'plataforma' | 'cabine') => {
    setActivePreset(preset);
    activePresetRef.current = preset;
    if (!cameraRef.current || !controlsRef.current || !mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight || 420;
    const currentAspect = w / h;
    const zoomFactor = currentAspect < 1.25 ? Math.max(1.0, 1.35 / Math.max(currentAspect, 0.52)) : 1.0;

    if (preset === 'geral') {
      cameraRef.current.position.set(12 * zoomFactor, 6.5 * (currentAspect < 1 ? 1.15 : 1.0), 14 * zoomFactor);
      controlsRef.current.target.set(0, currentAspect < 1 ? 1.3 : 1.8, 0);
    } else if (preset === 'plataforma') {
      cameraRef.current.position.set(-11 * zoomFactor, 4.5 * (currentAspect < 1 ? 1.15 : 1.0), 7 * zoomFactor);
      controlsRef.current.target.set(-2, 1.4, 0);
    } else if (preset === 'cabine') {
      cameraRef.current.position.set(8 * zoomFactor, 3.5 * (currentAspect < 1 ? 1.15 : 1.0), 6 * zoomFactor);
      controlsRef.current.target.set(3, 1.9, 0);
    }

    cameraRef.current.updateProjectionMatrix();
    controlsRef.current.update();
  };

  const getPhaseDescription = () => {
    if (cycleProgress === 0) {
      return {
        phase: 'Posição de Trânsito',
        detail: 'Representação ilustrativa da plataforma recolhida sobre o chassi',
        badge: 'Posição Recolhida',
      };
    }
    if (cycleProgress <= 35) {
      return {
        phase: 'Etapa 1: Recuo da Plataforma',
        detail: 'Representação ilustrativa do deslocamento horizontal traseiro da prancha',
        badge: 'Recuo Horizontal',
      };
    }
    return {
      phase: 'Etapa 2: Basculamento da Rampa',
      detail: 'Representação ilustrativa da inclinação da prancha para embarque do veículo',
      badge: 'Rampa Inclinada',
    };
  };

  const status = getPhaseDescription();

  return (
    <section
      id="modelo-3d"
      className={`py-12 sm:py-20 border-t transition-colors duration-300 relative ${
        isDarkMode
          ? 'bg-[#141416] border-neutral-800 text-neutral-100'
          : 'bg-slate-100 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2 font-heading">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Representação Conceitual & Ilustrativa 3D</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight uppercase font-heading leading-tight">
              {selectedModel === 'guincho-leve'
                ? 'DEMONSTRAÇÃO CONCEITUAL: PLATAFORMA PARA VEÍCULOS LEVES'
                : 'DEMONSTRAÇÃO CONCEITUAL: CAVALO MECÂNICO PESADO'}
            </h2>
            <p
              className={`mt-2 text-xs sm:text-base max-w-2xl leading-relaxed ${
                isDarkMode ? 'text-neutral-300' : 'text-slate-600'
              }`}
            >
              {selectedModel === 'guincho-leve'
                ? 'Visualização conceitual do movimento de recuo horizontal e basculamento de prancha utilizado no embarque de veículos leves.'
                : 'Visualização conceitual de um cavalo mecânico configurado para operações de acoplamento e remoção de veículos pesados.'}
            </p>
          </div>

          {/* Model Switcher Bar (Guincho Leve vs Cavalo Mecânico 1635) */}
          <div
            className={`p-1.5 rounded-xl border flex items-center gap-1.5 shadow-lg ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-white border-slate-300'
            }`}
            role="radiogroup"
            aria-label="Seleção do Modelo 3D"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedModel === 'guincho-leve'}
              onClick={() => setSelectedModel('guincho-leve')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                selectedModel === 'guincho-leve'
                  ? 'bg-[#B43034] text-white shadow-md'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Guincho Leve (Plataforma)</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={selectedModel === 'cavalo-1635'}
              onClick={() => setSelectedModel('cavalo-1635')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                selectedModel === 'cavalo-1635'
                  ? 'bg-[#B43034] text-white shadow-md'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Cavalo Mecânico 1635</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Pill regarding 3D Illustration */}
        <div
          className={`mt-4 p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
            isDarkMode
              ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400'
              : 'bg-white border-slate-200 text-slate-600 shadow-sm'
          }`}
        >
          <Info className="w-4 h-4 text-[#B43034] shrink-0 mt-0.5" />
          <p>
            <strong>Nota de Transparência:</strong> Os modelos 3D exibidos abaixo são <em>representações conceituais e ilustrativas</em> construídas para demonstrar visualmente a movimentação de uma plataforma e de um cavalo mecânico, não constituindo réplicas técnicas exatas dos veículos da empresa.
          </p>
        </div>
      </div>

      {/* 3D Viewport Card Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative w-full rounded-2xl border overflow-hidden shadow-2xl flex flex-col transition-colors duration-300 ${
            isDarkMode ? 'bg-[#111113] border-neutral-800' : 'bg-white border-slate-300'
          }`}
        >
          {/* WebGL Canvas Viewport Area */}
          <div className="relative w-full h-[320px] xs:h-[360px] sm:h-[440px] md:h-[500px] lg:h-[560px] overflow-hidden select-none">
            {webGlSupported ? (
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
              />
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4 ${
                  isDarkMode ? 'bg-neutral-950' : 'bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-10 h-10 text-amber-500" />
                <h3 className="text-xl font-bold font-heading uppercase">
                  Aceleração WebGL Indisponível no Navegador
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                  Seu dispositivo ou navegador não possui suporte ativo para aceleração 3D WebGL. Você pode conferir nossas fotografias reais da frota na galeria logo acima.
                </p>
              </div>
            )}

            {/* Badges on top-left */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none flex flex-wrap items-center gap-1.5 sm:gap-2 z-10 max-w-[72%] sm:max-w-none">
              <span
                className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border backdrop-blur-md font-heading ${
                  isDarkMode
                    ? 'bg-neutral-900/90 text-white border-neutral-800'
                    : 'bg-white/95 text-slate-900 border-slate-300 shadow-sm'
                }`}
              >
                {selectedModel === 'guincho-leve' ? 'Ilustração: Guincho Leve' : 'Ilustração: Cavalo Pesado'}
              </span>
              <span className="bg-red-950/90 text-red-200 text-[10px] sm:text-[11px] font-semibold tracking-wider px-2 sm:px-2.5 py-1 rounded border border-red-900/60 backdrop-blur-md">
                {selectedModel === 'guincho-leve' ? status.badge : 'Modelo Conceitual'}
              </span>
            </div>

            {/* 360 Hint on top-right */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 pointer-events-none z-10">
              <span
                className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded border backdrop-blur-md flex items-center gap-1.5 shadow-md ${
                  isDarkMode
                    ? 'bg-neutral-900/80 text-neutral-300 border-neutral-800'
                    : 'bg-white/90 text-slate-700 border-slate-300'
                }`}
              >
                <RotateCw className="w-3 h-3 text-[#B43034]" />
                <span className="hidden xs:inline">Gire 360° com Toque</span>
              </span>
            </div>

            {/* Floating actions on bottom-right of canvas */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
              {selectedModel === 'guincho-leve' && (
                <button
                  type="button"
                  onClick={() => setIsAutoCycle(!isAutoCycle)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-lg backdrop-blur-md transition-colors ${
                    isAutoCycle
                      ? 'bg-[#B43034] text-white border-[#B43034]'
                      : isDarkMode
                      ? 'bg-neutral-900/90 text-white border-neutral-700 hover:bg-neutral-800'
                      : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-100 shadow-md'
                  }`}
                  title={isAutoCycle ? 'Pausar animação' : 'Demonstrar ciclo automático'}
                >
                  {isAutoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#B43034]" />}
                  <span className="text-[11px]">{isAutoCycle ? 'Pausar' : 'Demonstrar'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-lg border shadow-lg backdrop-blur-md transition-colors ${
                  isRotating
                    ? isDarkMode
                      ? 'bg-neutral-800/90 border-neutral-600 text-white'
                      : 'bg-slate-200 border-slate-400 text-slate-900'
                    : isDarkMode
                    ? 'bg-neutral-900/90 border-neutral-700 text-neutral-400 hover:text-white'
                    : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
                title={isRotating ? 'Pausar rotação contínua' : 'Ativar rotação 360° contínua'}
                aria-label="Alternar rotação contínua"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Control Deck below canvas */}
          <div
            className={`w-full border-t p-3.5 pb-6 sm:p-5 space-y-3.5 z-10 transition-colors duration-300 ${
              isDarkMode ? 'bg-neutral-900/95 border-neutral-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {selectedModel === 'guincho-leve' ? (
              <>
                {/* Status Readout Banner */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 sm:py-2.5 rounded-lg border text-xs gap-1.5 sm:gap-2 ${
                    isDarkMode
                      ? 'bg-neutral-950/80 border-neutral-800 text-neutral-300'
                      : 'bg-white border-slate-300 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B43034] shrink-0" />
                      <span className="font-bold uppercase tracking-wider font-heading">{status.phase}</span>
                    </div>
                    <span className="text-neutral-500 hidden sm:inline">—</span>
                    <span className="text-[11px] sm:text-xs pl-4 sm:pl-0">{status.detail}</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#B43034] bg-red-950/20 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30 shrink-0 self-start sm:self-auto">
                    SIMULAÇÃO ILUSTRATIVA
                  </div>
                </div>

                {/* Slider & Presets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider font-heading">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#B43034]" />
                        <span>Controle Ilustrativo da Rampa:</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {cycleProgress <= 35 ? 'Etapa 1: Recuo' : 'Etapa 2: Inclinação'}
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
                      className="w-full accent-[#B43034] h-2.5 rounded-lg cursor-pointer touch-none"
                      aria-label="Controle ilustrativo da posição da rampa"
                      title="Controle ilustrativo da posição da rampa"
                    />

                    {/* Step presets */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 font-heading">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(0);
                        }}
                        className={`text-[10px] sm:text-[11px] font-semibold py-1 px-1 rounded border transition-colors text-center ${
                          cycleProgress === 0
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : isDarkMode
                            ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                        }`}
                      >
                        Posição Trânsito
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(35);
                        }}
                        className={`text-[10px] sm:text-[11px] font-semibold py-1 px-1 rounded border transition-colors text-center ${
                          cycleProgress === 35
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : isDarkMode
                            ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                        }`}
                      >
                        Recuo da Prancha
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoCycle(false);
                          setCycleProgress(100);
                        }}
                        className={`text-[10px] sm:text-[11px] font-semibold py-1 px-1 rounded border transition-colors text-center ${
                          cycleProgress === 100
                            ? 'bg-[#B43034] text-white border-[#B43034]'
                            : isDarkMode
                            ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                        }`}
                      >
                        Posição Embarque
                      </button>
                    </div>
                  </div>

                  {/* Camera view buttons */}
                  <div className="lg:col-span-5 flex items-center justify-between sm:justify-end gap-2 pt-2 lg:pt-0 font-heading">
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg border w-full sm:w-auto justify-center ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-slate-300 shadow-sm'
                      }`}
                    >
                      <span className={`text-[10px] uppercase px-1.5 font-bold hidden xs:inline ${isDarkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                        Ângulo:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCameraPreset('geral')}
                        className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
                          activePreset === 'geral'
                            ? 'bg-[#B43034] text-white font-semibold'
                            : isDarkMode
                            ? 'text-neutral-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Geral
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraPreset('plataforma')}
                        className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
                          activePreset === 'plataforma'
                            ? 'bg-[#B43034] text-white font-semibold'
                            : isDarkMode
                            ? 'text-neutral-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Rampa
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraPreset('cabine')}
                        className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
                          activePreset === 'cabine'
                            ? 'bg-[#B43034] text-white font-semibold'
                            : isDarkMode
                            ? 'text-neutral-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Cabine
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Heavy Tractor Conceptual Deck (Model 2: Cavalo Mecânico) */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acoplamento Pesado</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Representação conceitual da quinta roda para operações de tração e deslocamento pesado.
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Estrutura Rodoviária</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Configuração voltada ao suporte operacional de caminhões e composições sob consulta.
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Atendimento Sob Consulta</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Consulte a equipe via WhatsApp para verificar disponibilidade e especificações para sua demanda.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
