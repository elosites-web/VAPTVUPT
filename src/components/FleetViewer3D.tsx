import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  RotateCw,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  Info,
  Truck,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BrandSpinner, useDelayedLoadingState } from './BrandSpinner';
import { RevealSection } from './RevealSection';

export type TruckModelType = 'guincho-leve' | 'cavalo-1635';
export type CameraPresetType = 'geral' | 'plataforma' | 'cabine';

// Pre-allocated module-scope vectors to avoid GC allocations inside the render loop
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

export const FleetViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const { isDarkMode } = useTheme();

  // Selected Truck Model & Camera Preset State
  const [selectedModel, setSelectedModel] = useState<TruckModelType>('guincho-leve');
  const [activePreset, setActivePreset] = useState<CameraPresetType>('geral');
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);

  const { visible: showSceneSpinner } = useDelayedLoadingState(
    webGlSupported && !isSceneReady,
    {
      delayMs: 180,
      maxWaitMs: 6000,
      onTimeout: () => setIsSceneReady(true),
    }
  );

  // Platform operation cycle progress (0 to 100%) for Guincho Leve
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(false);

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

  // Mutable animation state refs (decoupled from React render cycle to prevent mobile CPU bottlenecks)
  const selectedModelRef = useRef<TruckModelType>('guincho-leve');
  const isRotatingRef = useRef<boolean>(true);
  const isAutoCycleRef = useRef<boolean>(false);
  const cycleProgressRef = useRef<number>(0);
  const autoCycleDirRef = useRef<1 | -1>(1);
  const activePresetRef = useRef<CameraPresetType>('geral');
  const isCameraTransitioningRef = useRef<boolean>(false);
  const wakeRenderLoopRef = useRef<(() => void) | null>(null);
  const updateCameraTargetsRef = useRef<((preset: CameraPresetType, immediate?: boolean) => void) | null>(null);

  // Compute responsive camera target coordinates for any viewport aspect ratio
  const computePresetVectors = useCallback(
    (w: number, h: number, preset: CameraPresetType, model: TruckModelType) => {
      const aspect = Math.max(0.45, w / Math.max(1, h));
      const isPortrait = aspect < 0.95;
      // Dynamic distance multiplier so the entire truck fits comfortably on vertical mobile screens
      const modelBaseMultiplier = model === 'cavalo-1635' ? 1.05 : 1.0;
      const portraitZoom = isPortrait
        ? Math.min(1.85, Math.max(1.18, 1.12 / Math.max(aspect, 0.56))) * modelBaseMultiplier
        : modelBaseMultiplier;

      if (preset === 'geral') {
        _targetCamPos.set(
          10.8 * portraitZoom,
          5.4 * (isPortrait ? 1.1 : 1.0),
          12.8 * portraitZoom
        );
        _targetLookAt.set(0, isPortrait ? 1.35 : 1.65, 0);
      } else if (preset === 'plataforma') {
        _targetCamPos.set(
          -10.2 * portraitZoom,
          4.2 * (isPortrait ? 1.12 : 1.0),
          6.8 * portraitZoom
        );
        _targetLookAt.set(-1.6, 1.35, 0);
      } else {
        // 'cabine'
        _targetCamPos.set(
          7.4 * portraitZoom,
          3.3 * (isPortrait ? 1.1 : 1.0),
          5.8 * portraitZoom
        );
        _targetLookAt.set(2.4, 1.75, 0);
      }
    },
    []
  );

  // Check initial prefers-reduced-motion only for initial auto-rotate state (never blocks explicit user click on "Demonstrar")
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mql.matches) {
        setIsRotating(false);
        isRotatingRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    isRotatingRef.current = isRotating;
    wakeRenderLoopRef.current?.();
  }, [isRotating]);

  useEffect(() => {
    isAutoCycleRef.current = isAutoCycle;
    wakeRenderLoopRef.current?.();
  }, [isAutoCycle]);

  // Synchronize 3D model visibility with selectedModel state and smoothly re-frame camera
  useEffect(() => {
    selectedModelRef.current = selectedModel;
    if (guinchoGroupRef.current) {
      guinchoGroupRef.current.visible = selectedModel === 'guincho-leve';
    }
    if (heavyTractorGroupRef.current) {
      heavyTractorGroupRef.current.visible = selectedModel === 'cavalo-1635';
    }
    setActivePreset('geral');
    activePresetRef.current = 'geral';
    updateCameraTargetsRef.current?.('geral', false);
    if (rendererRef.current) {
      rendererRef.current.shadowMap.needsUpdate = true;
    }
    wakeRenderLoopRef.current?.();
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
    wakeRenderLoopRef.current?.();
  }, [isDarkMode]);

  // Main Three.js Scene Setup with Mobile Memory/CPU Optimization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability & software WebGL renderer safely
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

    const isMobileViewport =
      window.innerWidth < 768 || window.matchMedia?.('(pointer: coarse)').matches;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isMobileViewport,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      });
    } catch (e) {
      console.warn('WebGL Renderer initialization failed:', e);
      setWebGlSupported(false);
      return;
    }

    // Cap pixel ratio on mobile vertical screens to prevent fill-rate & thermal throttling
    const maxDpr = isSoftwareGl ? 1 : isMobileViewport ? 1.2 : 1.75;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Optimize shadow map updates: only re-render shadow map when ramp tilts or model switches
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = isMobileViewport ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Track geometries and materials for 100% deterministic memory disposal
    const geometriesToDispose = new Set<THREE.BufferGeometry>();
    const materialsToDispose = new Set<THREE.Material>();
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometriesToDispose.add(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materialsToDispose.add(m);
      return m;
    };

    // ==========================================
    // INDUSTRIAL LOGISTICS SCENERY & HORIZON FOG
    // ==========================================
    const scene = new THREE.Scene();
    const initialBgHex = isDarkMode ? 0x131316 : 0xf1f3f5;
    scene.background = new THREE.Color(initialBgHex);
    scene.fog = new THREE.Fog(initialBgHex, 15, 52);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.2, 85);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minPolarAngle = 0.15;
    controls.enablePan = false;
    controls.rotateSpeed = isMobileViewport ? 0.75 : 0.9;
    controls.zoomSpeed = 0.85;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controlsRef.current = controls;

    // Target vectors for smooth camera preset transitions
    const desiredCamPos = new THREE.Vector3();
    const desiredLookAt = new THREE.Vector3();

    const syncCameraTargets = (preset: CameraPresetType, immediate = false) => {
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      const currentAspect = Math.max(0.45, w / Math.max(1, h));
      camera.aspect = currentAspect;
      camera.fov = currentAspect < 0.88 ? 46 : 40;
      controls.minDistance = currentAspect < 1 ? 7.2 : 6.0;
      controls.maxDistance = currentAspect < 1 ? 32 : 26;
      camera.updateProjectionMatrix();

      computePresetVectors(w, h, preset, selectedModelRef.current);
      desiredCamPos.copy(_targetCamPos);
      desiredLookAt.copy(_targetLookAt);

      if (immediate) {
        camera.position.copy(desiredCamPos);
        controls.target.copy(desiredLookAt);
        controls.update();
        isCameraTransitioningRef.current = false;
      } else {
        isCameraTransitioningRef.current = true;
      }
    };

    updateCameraTargetsRef.current = syncCameraTargets;
    syncCameraTargets('geral', true);

    // Cancel scripted camera transition if user manually grabs the canvas
    const handleControlStart = () => {
      isCameraTransitioningRef.current = false;
      wakeRenderLoopRef.current?.();
    };
    controls.addEventListener('start', handleControlStart);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Lighting Rig
    const hemiLight = new THREE.HemisphereLight(
      isDarkMode ? 0xe4e7eb : 0xffffff,
      isDarkMode ? 0x18181c : 0xcfd8dc,
      0.95
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 2.4 : 2.8);
    keyLight.position.set(14, 18, 12);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      const shadowMapRes = isMobileViewport ? 512 : 1024;
      keyLight.shadow.mapSize.width = shadowMapRes;
      keyLight.shadow.mapSize.height = shadowMapRes;
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 42;
      const d = 9.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Corporate red edge accent light (#B43034) & silver rim light (#cbd5e1)
    const redAccentLight = new THREE.DirectionalLight(0xb43034, 1.3);
    redAccentLight.position.set(-14, 7, -9);
    scene.add(redAccentLight);

    const silverRimLight = new THREE.DirectionalLight(0xe2e8f0, 0.85);
    silverRimLight.position.set(6, 5, -14);
    scene.add(silverRimLight);

    // Floor
    const floorGeo = trackGeo(new THREE.PlaneGeometry(100, 100));
    const floorMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x202024 : 0xd5d9de,
        roughness: 0.82,
        metalness: 0.12,
      })
    );
    floorMatRef.current = floorMat;
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    floor.matrixAutoUpdate = false;
    floor.updateMatrix();
    scene.add(floor);

    // Logistics staging bay rings (Brand Red #B43034 + Silver #CBD5E1) with polygonOffset to avoid Z-fighting
    const ringSegments = isMobileViewport ? 48 : 64;
    const ringGeo = trackGeo(new THREE.RingGeometry(6.35, 6.55, ringSegments));
    const ringMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xb43034,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.58,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.015;
    ring.matrixAutoUpdate = false;
    ring.updateMatrix();
    scene.add(ring);

    const silverRingGeo = trackGeo(new THREE.RingGeometry(5.98, 6.08, ringSegments));
    const silverRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xcbd5e1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.38,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const silverRing = new THREE.Mesh(silverRingGeo, silverRingMat);
    silverRing.rotation.x = -Math.PI / 2;
    silverRing.position.y = 0.014;
    silverRing.matrixAutoUpdate = false;
    silverRing.updateMatrix();
    scene.add(silverRing);

    // Contact shadow grounding plane beneath vehicle
    const shadowGeo = trackGeo(new THREE.PlaneGeometry(13.5, 4.8));
    const shadowMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-0.4, 0.02, 0);
    shadow.matrixAutoUpdate = false;
    shadow.updateMatrix();
    scene.add(shadow);

    // Shared Warehouse Geometries & Materials (reused across all columns to save memory)
    const industrialGroup = new THREE.Group();
    const steelColumnMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x1e1e24 : 0x94a3b8,
        roughness: 0.6,
        metalness: 0.8,
      })
    );
    steelColumnMatRef.current = steelColumnMat;

    const brandStripRedMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb43034,
        emissive: 0xb43034,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.5,
      })
    );
    const brandStripSilverMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.9,
      })
    );

    const sharedColGeo = trackGeo(new THREE.BoxGeometry(0.5, 12, 0.5));
    const sharedRedBandGeo = trackGeo(new THREE.BoxGeometry(0.54, 0.35, 0.54));
    const sharedSilverBandGeo = trackGeo(new THREE.BoxGeometry(0.53, 0.14, 0.53));

    [-14, -8, -2, 4, 10, 16].forEach((xPos) => {
      const column = new THREE.Mesh(sharedColGeo, steelColumnMat);
      column.position.set(xPos, 6, -14);
      column.matrixAutoUpdate = false;
      column.updateMatrix();
      industrialGroup.add(column);

      const redBand = new THREE.Mesh(sharedRedBandGeo, brandStripRedMat);
      redBand.position.set(xPos, 3.2, -14);
      redBand.matrixAutoUpdate = false;
      redBand.updateMatrix();
      industrialGroup.add(redBand);

      const silverBand = new THREE.Mesh(sharedSilverBandGeo, brandStripSilverMat);
      silverBand.position.set(xPos, 3.55, -14);
      silverBand.matrixAutoUpdate = false;
      silverBand.updateMatrix();
      industrialGroup.add(silverBand);
    });

    const trussGeo = trackGeo(new THREE.BoxGeometry(34, 0.65, 0.7));
    const trussBeam = new THREE.Mesh(trussGeo, steelColumnMat);
    trussBeam.position.set(1, 10.5, -14);
    trussBeam.matrixAutoUpdate = false;
    trussBeam.updateMatrix();
    industrialGroup.add(trussBeam);

    const trussRedGeo = trackGeo(new THREE.BoxGeometry(34, 0.12, 0.74));
    const trussRedAccent = new THREE.Mesh(trussRedGeo, brandStripRedMat);
    trussRedAccent.position.set(1, 10.15, -14);
    trussRedAccent.matrixAutoUpdate = false;
    trussRedAccent.updateMatrix();
    industrialGroup.add(trussRedAccent);

    const backWallGeo = trackGeo(new THREE.PlaneGeometry(60, 18));
    const backWallMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x141418 : 0xe3e7ec,
        roughness: 0.95,
        metalness: 0.05,
      })
    );
    backWallMatRef.current = backWallMat;
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 9, -20);
    backWall.matrixAutoUpdate = false;
    backWall.updateMatrix();
    industrialGroup.add(backWall);

    scene.add(industrialGroup);

    // Common PBR Materials for Trucks
    const redMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xb43034, roughness: 0.28, metalness: 0.18 })
    );
    const whiteMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.34, metalness: 0.1 })
    );
    const graphiteMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.55, metalness: 0.45 })
    );
    const darkSteelMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x161618, roughness: 0.62, metalness: 0.8 })
    );
    const chromeMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.14, metalness: 0.94 })
    );
    const glassMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    const rubberMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.85, metalness: 0.05 })
    );
    const beaconMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      })
    );

    const cylSegments = isMobileViewport ? 16 : 22;

    // ========================================================
    // MODEL 1: GUINCHO LEVE PLATAFORMA (VW DELIVERY)
    // ========================================================
    const guinchoGroup = new THREE.Group();
    guinchoGroupRef.current = guinchoGroup;

    const chassisGeo = trackGeo(new THREE.BoxGeometry(10.2, 0.35, 1.4));
    const chassis = new THREE.Mesh(chassisGeo, graphiteMat);
    chassis.position.set(0, 0.85, 0);
    chassis.castShadow = !isSoftwareGl;
    guinchoGroup.add(chassis);

    const tankGeo = trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 1.8, cylSegments));
    const tankL = new THREE.Mesh(tankGeo, chromeMat);
    tankL.rotation.z = Math.PI / 2;
    tankL.position.set(-0.5, 0.65, 0.9);
    guinchoGroup.add(tankL);

    const toolboxGeo = trackGeo(new THREE.BoxGeometry(1.6, 0.5, 0.6));
    const toolboxR = new THREE.Mesh(toolboxGeo, darkSteelMat);
    toolboxR.position.set(-0.5, 0.65, -0.9);
    guinchoGroup.add(toolboxR);

    // Shared wheel geometries for Model 1
    const frontTireGeo1 = trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.36, cylSegments));
    const rearTireGeo1 = trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.42, cylSegments));
    const frontRimGeo1 = trackGeo(new THREE.CylinderGeometry(0.285, 0.285, 0.38, 12));
    const rearRimGeo1 = trackGeo(new THREE.CylinderGeometry(0.285, 0.285, 0.44, 12));

    const wheelPositions1 = [
      { x: 3.4, z: 1.15, isFront: true },
      { x: 3.4, z: -1.15, isFront: true },
      { x: -2.2, z: 1.15, isFront: false },
      { x: -2.2, z: -1.15, isFront: false },
      { x: -3.5, z: 1.15, isFront: false },
      { x: -3.5, z: -1.15, isFront: false },
    ];
    wheelPositions1.forEach((pos) => {
      const tire = new THREE.Mesh(pos.isFront ? frontTireGeo1 : rearTireGeo1, rubberMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(pos.x, 0.52, pos.z);
      const rim = new THREE.Mesh(pos.isFront ? frontRimGeo1 : rearRimGeo1, chromeMat);
      tire.add(rim);
      guinchoGroup.add(tire);
    });

    // Cabin
    const cabGroup1 = new THREE.Group();
    cabGroup1.position.set(3.0, 1.0, 0);

    const cabLower = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 1.2, 2.2)), whiteMat);
    cabLower.position.set(0, 0.6, 0);
    cabLower.castShadow = !isSoftwareGl;
    cabGroup1.add(cabLower);

    const hood = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.4, 0.9, 2.0)), redMat);
    hood.position.set(1.4, 0.45, 0);
    hood.castShadow = !isSoftwareGl;
    cabGroup1.add(hood);

    const grille = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.7, 1.4)), darkSteelMat);
    grille.position.set(2.11, 0.45, 0);
    cabGroup1.add(grille);

    const cabUpper = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.1, 1.1, 2.15)), whiteMat);
    cabUpper.position.set(-0.1, 1.75, 0);
    cabUpper.castShadow = !isSoftwareGl;
    cabGroup1.add(cabUpper);

    const windshield = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.85, 1.85)), glassMat);
    windshield.position.set(0.96, 1.75, 0);
    windshield.rotation.z = -Math.PI / 20;
    windshield.renderOrder = 2;
    cabGroup1.add(windshield);

    const beaconBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.3, 0.12, 1.4)), beaconMat);
    beaconBar.position.set(-0.1, 2.38, 0);
    cabGroup1.add(beaconBar);

    guinchoGroup.add(cabGroup1);

    // Tilting Subframe Pivot (Rear Hinge at X = -3.5, Y = 1.02)
    const platformPivot = new THREE.Group();
    platformPivot.position.set(-3.5, 1.02, 0);
    platformPivotRef.current = platformPivot;

    const subframeGroup = new THREE.Group();
    subframeGroup.position.set(3.5, -1.02, 0);

    const subframeRailGeo = trackGeo(new THREE.BoxGeometry(6.4, 0.22, 0.2));
    const railL = new THREE.Mesh(subframeRailGeo, darkSteelMat);
    railL.position.set(-1.55, 1.15, 0.75);
    subframeGroup.add(railL);

    const railR = new THREE.Mesh(subframeRailGeo, darkSteelMat);
    railR.position.set(-1.55, 1.15, -0.75);
    subframeGroup.add(railR);

    // Sliding Platform Deck (posicionada em X = 1.65 na Posição de Trânsito, logo atrás da cabine em X = 1.80)
    const platformDeck = new THREE.Group();
    platformDeck.position.set(1.65, 0, 0);
    platformDeckRef.current = platformDeck;

    const deckGeo = trackGeo(new THREE.BoxGeometry(7.2, 0.16, 2.36));
    const deck = new THREE.Mesh(deckGeo, redMat);
    deck.position.set(-3.6, 1.35, 0);
    deck.castShadow = !isSoftwareGl;
    deck.receiveShadow = !isSoftwareGl;
    platformDeck.add(deck);

    // Silver side safety trim on deck
    const sideTrimGeo = trackGeo(new THREE.BoxGeometry(7.22, 0.08, 2.4));
    const sideTrim = new THREE.Mesh(sideTrimGeo, chromeMat);
    sideTrim.position.set(-3.6, 1.29, 0);
    platformDeck.add(sideTrim);

    // Headboard rack & winch (situados na extremidade frontal da prancha, logo atrás da cabine)
    const rack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.2, 1.3, 2.34)), darkSteelMat);
    rack.position.set(-0.05, 2.05, 0);
    platformDeck.add(rack);

    const winch = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 12)),
      chromeMat
    );
    winch.rotation.x = Math.PI / 2;
    winch.position.set(-0.05, 1.55, 0);
    platformDeck.add(winch);

    subframeGroup.add(platformDeck);
    platformPivot.add(subframeGroup);
    guinchoGroup.add(platformPivot);

    // Hydraulic Pistons (shared geometries)
    const pistonBarrelGeo = trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 1, 10));
    const pistonRodGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 1, 10));
    const createPiston = () => {
      const g = new THREE.Group();
      const barrel = new THREE.Mesh(pistonBarrelGeo, darkSteelMat);
      barrel.position.y = -0.25;
      g.add(barrel);
      const rod = new THREE.Mesh(pistonRodGeo, chromeMat);
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

    const heavyChassis = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(8.4, 0.45, 1.5)),
      darkSteelMat
    );
    heavyChassis.position.set(-0.2, 0.95, 0);
    heavyChassis.castShadow = !isSoftwareGl;
    heavyTractorGroup.add(heavyChassis);

    const heavyBumper = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.55, 0.65, 2.45)),
      darkSteelMat
    );
    heavyBumper.position.set(3.9, 0.75, 0);
    heavyTractorGroup.add(heavyBumper);

    const hook = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.14, 0.04, 8, 14)), chromeMat);
    hook.position.set(4.2, 0.6, 0);
    heavyTractorGroup.add(hook);

    const heavyCab = new THREE.Group();
    heavyCab.position.set(2.4, 1.15, 0);

    const mbLower = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.6, 1.4, 2.3)), whiteMat);
    mbLower.position.set(0, 0.7, 0);
    mbLower.castShadow = !isSoftwareGl;
    heavyCab.add(mbLower);

    const mbHood = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.5, 0.95, 2.1)), redMat);
    mbHood.position.set(1.4, 0.55, 0);
    mbHood.castShadow = !isSoftwareGl;
    heavyCab.add(mbHood);

    const mbGrille = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.8, 1.6)), darkSteelMat);
    mbGrille.position.set(2.16, 0.55, 0);
    heavyCab.add(mbGrille);

    const star = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 14)),
      chromeMat
    );
    star.rotation.z = Math.PI / 2;
    star.position.set(2.22, 0.65, 0);
    heavyCab.add(star);

    const mbUpper = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.3, 1.3, 2.25)), whiteMat);
    mbUpper.position.set(-0.15, 2.05, 0);
    mbUpper.castShadow = !isSoftwareGl;
    heavyCab.add(mbUpper);

    const mbWindshield = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.1, 0.95, 2.0)),
      glassMat
    );
    mbWindshield.position.set(0.98, 2.05, 0);
    mbWindshield.rotation.z = -Math.PI / 22;
    mbWindshield.renderOrder = 2;
    heavyCab.add(mbWindshield);

    const deflector = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.6, 0.55, 2.2)), redMat);
    deflector.position.set(-0.25, 2.9, 0);
    deflector.rotation.z = Math.PI / 18;
    heavyCab.add(deflector);

    const exhaustGeo = trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 2.8, 12));
    const exhaustL = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustL.position.set(-1.4, 2.4, 0.95);
    heavyCab.add(exhaustL);

    const exhaustR = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustR.position.set(-1.4, 2.4, -0.95);
    heavyCab.add(exhaustR);

    const guardGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 1.8, 12, 1, true));
    const guardMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true,
      })
    );
    const guardL = new THREE.Mesh(guardGeo, guardMat);
    guardL.position.set(-1.4, 2.0, 0.95);
    heavyCab.add(guardL);

    const guardR = new THREE.Mesh(guardGeo, guardMat);
    guardR.position.set(-1.4, 2.0, -0.95);
    heavyCab.add(guardR);

    const spiralGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 10));
    const cableRedMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    const cableYellowMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xf59e0b }));

    const cableRed = new THREE.Mesh(spiralGeo, cableRedMat);
    cableRed.rotation.z = Math.PI / 3;
    cableRed.position.set(-1.6, 1.1, 0.25);
    heavyCab.add(cableRed);

    const cableYellow = new THREE.Mesh(spiralGeo, cableYellowMat);
    cableYellow.rotation.z = Math.PI / 3;
    cableYellow.position.set(-1.6, 1.1, -0.25);
    heavyCab.add(cableYellow);

    heavyTractorGroup.add(heavyCab);

    // Fifth Wheel (Quinta Roda)
    const fifthWheelGroup = new THREE.Group();
    fifthWheelGroup.position.set(-1.8, 1.25, 0);

    const plate = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.65, 0.72, 0.14, 18)),
      darkSteelMat
    );
    plate.position.y = 0.07;
    fifthWheelGroup.add(plate);

    const slot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.7, 0.16, 0.22)), chromeMat);
    slot.position.set(-0.2, 0.08, 0);
    fifthWheelGroup.add(slot);

    const mountPlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.6, 0.2, 1.3)),
      graphiteMat
    );
    mountPlate.position.set(0, -0.05, 0);
    fifthWheelGroup.add(mountPlate);

    heavyTractorGroup.add(fifthWheelGroup);

    // Dual cylindrical diesel tanks
    const dieselTankGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 2.4, cylSegments));
    const tankLeft = new THREE.Mesh(dieselTankGeo, chromeMat);
    tankLeft.rotation.z = Math.PI / 2;
    tankLeft.position.set(0.3, 0.75, 1.05);
    heavyTractorGroup.add(tankLeft);

    const tankRight = new THREE.Mesh(dieselTankGeo, chromeMat);
    tankRight.rotation.z = Math.PI / 2;
    tankRight.position.set(0.3, 0.75, -1.05);
    heavyTractorGroup.add(tankRight);

    // Shared Heavy Wheels Geometries
    const heavyFrontTireGeo = trackGeo(new THREE.CylinderGeometry(0.56, 0.56, 0.38, cylSegments));
    const heavyRearTireGeo = trackGeo(new THREE.CylinderGeometry(0.56, 0.56, 0.46, cylSegments));
    const heavyFrontRimGeo = trackGeo(new THREE.CylinderGeometry(0.29, 0.29, 0.4, 12));
    const heavyRearRimGeo = trackGeo(new THREE.CylinderGeometry(0.29, 0.29, 0.48, 12));

    const heavyWheelPositions = [
      { x: 2.8, z: 1.18, isFront: true },
      { x: 2.8, z: -1.18, isFront: true },
      { x: -1.2, z: 1.25, isFront: false },
      { x: -1.2, z: -1.25, isFront: false },
      { x: -2.5, z: 1.25, isFront: false },
      { x: -2.5, z: -1.25, isFront: false },
    ];

    heavyWheelPositions.forEach((pos) => {
      const tire = new THREE.Mesh(pos.isFront ? heavyFrontTireGeo : heavyRearTireGeo, rubberMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(pos.x, 0.56, pos.z);
      const rim = new THREE.Mesh(pos.isFront ? heavyFrontRimGeo : heavyRearRimGeo, chromeMat);
      tire.add(rim);
      heavyTractorGroup.add(tire);
    });

    heavyTractorGroup.visible = false;
    scene.add(heavyTractorGroup);

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      try {
        renderer.compile(scene, camera);
      } catch {
        // Ignore shader pre-compile warning on older drivers
      }
    }

    // ========================================================
    // OPTIMIZED ANIMATION LOOP & HARDWARE/SOFTWARE PACING
    // ========================================================
    let frameId = 0;
    let isLoopRunning = false;
    let isInViewport = true;
    let isTabVisible = !document.hidden;
    let lastTime = performance.now();
    let lastStateSyncTime = 0;
    let currentSlide = 0;
    let currentTilt = 0;
    let heavyTourElapsed = 0;

    // Initialize platform kinematics (recuo se move horizontalmente no sentido oposto à cabine)
    const applyPlatformKinematics = (slide: number, tilt: number) => {
      if (platformDeckRef.current) {
        platformDeckRef.current.position.x = 1.65 - slide;
      }
      const rad = THREE.MathUtils.degToRad(tilt);
      if (platformPivotRef.current) {
        platformPivotRef.current.rotation.z = rad;
      }

      const baseX = -1.8;
      const baseY = 0.85;
      const R = 2.4;
      const topX = -3.5 + R * Math.cos(rad);
      const topY = 1.02 + R * Math.sin(rad);
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
    };

    // Software WebGL GPU-fence pacing helper to prevent headless/CPU lockups
    const afterDraw = (cb: () => void) => {
      const glCtx = renderer.getContext() as WebGL2RenderingContext;
      if (glCtx && typeof glCtx.fenceSync === 'function') {
        const sync = glCtx.fenceSync(glCtx.SYNC_GPU_COMMANDS_COMPLETE, 0);
        glCtx.flush();
        const poll = () => {
          const state = sync && glCtx.getSyncParameter(sync, glCtx.SYNC_STATUS);
          if (state === glCtx.UNSIGNALED) {
            frameId = window.setTimeout(poll, 8);
          } else {
            if (sync) glCtx.deleteSync(sync);
            frameId = window.setTimeout(cb, 65);
          }
        };
        frameId = window.setTimeout(poll, 8);
      } else {
        frameId = window.setTimeout(cb, 65);
      }
    };

    const tick = () => {
      if (!isInViewport || !isTabVisible) {
        isLoopRunning = false;
        return;
      }

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      let needsShadowUpdate = false;

      // 1. Automatic Demonstration Mode ("Demonstrar")
      if (isAutoCycleRef.current) {
        if (selectedModelRef.current === 'guincho-leve') {
          // Smoothly cycle hydraulic ramp from 0% <-> 100% with brief pause at extremes
          let nextP = cycleProgressRef.current + autoCycleDirRef.current * 24 * delta;
          if (nextP >= 100) {
            nextP = 100;
            autoCycleDirRef.current = -1;
          } else if (nextP <= 0) {
            nextP = 0;
            autoCycleDirRef.current = 1;
          }
          cycleProgressRef.current = nextP;

          // Update DOM slider and text label directly without triggering React re-renders every frame
          const rounded = Math.round(nextP);
          if (sliderInputRef.current) {
            sliderInputRef.current.value = String(rounded);
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent =
              rounded <= 35
                ? `Etapa 1: Recuo (${rounded}%)`
                : `Etapa 2: Inclinação (${rounded}%)`;
          }

          // Throttle React state sync to ~4 times per second so badges stay accurate with zero main-thread lag
          if (now - lastStateSyncTime > 240 || rounded === 0 || rounded === 35 || rounded === 100) {
            lastStateSyncTime = now;
            setCycleProgress(rounded);
          }
        } else {
          // On Cavalo 1635, automatic demonstration smoothly tours camera angles + rotates 360°
          heavyTourElapsed += delta;
          if (heavyTourElapsed > 4.2) {
            heavyTourElapsed = 0;
            const order: CameraPresetType[] = ['geral', 'cabine', 'plataforma'];
            const nextIdx = (order.indexOf(activePresetRef.current) + 1) % order.length;
            const nextPreset = order[nextIdx];
            activePresetRef.current = nextPreset;
            setActivePreset(nextPreset);
            syncCameraTargets(nextPreset, false);
          }
        }
      }

      // 2. Hydraulic Platform Kinematics (Guincho Leve)
      const p = Math.max(0, Math.min(100, cycleProgressRef.current)) / 100;
      let targetSlide = 0;
      let targetTilt = 0;

      if (p <= 0.35) {
        targetSlide = (p / 0.35) * 2.5;
        targetTilt = 0;
      } else {
        targetSlide = 2.5;
        targetTilt = ((p - 0.35) / 0.65) * 16.0;
      }

      const prevSlide = currentSlide;
      const prevTilt = currentTilt;
      currentSlide = THREE.MathUtils.damp(currentSlide, targetSlide, 7, delta);
      currentTilt = THREE.MathUtils.damp(currentTilt, targetTilt, 7, delta);

      if (Math.abs(currentSlide - prevSlide) > 0.0005 || Math.abs(currentTilt - prevTilt) > 0.0005) {
        applyPlatformKinematics(currentSlide, currentTilt);
        needsShadowUpdate = true;
      }

      // 3. Smooth Camera Preset Interpolation
      if (isCameraTransitioningRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamPos.x, 5.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamPos.y, 5.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamPos.z, 5.5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, desiredLookAt.x, 6.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, desiredLookAt.y, 6.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, desiredLookAt.z, 6.5, delta);

        if (
          camera.position.distanceToSquared(desiredCamPos) < 0.002 &&
          controls.target.distanceToSquared(desiredLookAt) < 0.002
        ) {
          isCameraTransitioningRef.current = false;
        }
      }

      // 4. Slow 360° Showcase Rotation
      if (isRotatingRef.current || (isAutoCycleRef.current && selectedModelRef.current === 'cavalo-1635')) {
        const rotStep = 0.26 * delta;
        if (guinchoGroupRef.current) guinchoGroupRef.current.rotation.y += rotStep;
        if (heavyTractorGroupRef.current) heavyTractorGroupRef.current.rotation.y += rotStep;
        needsShadowUpdate = true;
      }

      if (needsShadowUpdate && !isSoftwareGl) {
        renderer.shadowMap.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      // Keep looping only while there is active motion; otherwise enter low-power idle
      const hasActiveMotion =
        isAutoCycleRef.current ||
        isRotatingRef.current ||
        isCameraTransitioningRef.current ||
        Math.abs(currentSlide - targetSlide) > 0.001 ||
        Math.abs(currentTilt - targetTilt) > 0.001;

      if (hasActiveMotion) {
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      } else {
        isLoopRunning = false;
      }
    };

    const wakeLoop = () => {
      if (!isLoopRunning && isInViewport && isTabVisible) {
        isLoopRunning = true;
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    };

    wakeRenderLoopRef.current = wakeLoop;

    // Also wake loop when user orbits manually when idle
    const handleControlChange = () => {
      if (!isLoopRunning && isInViewport && isTabVisible) {
        renderer.render(scene, camera);
      }
    };
    controls.addEventListener('change', handleControlChange);

    // Apply initial platform pose (Posição de Trânsito recolhida atrás da cabine), render first frame, and start loop
    applyPlatformKinematics(0, 0);
    currentSlide = 0;
    currentTilt = 0;
    renderer.render(scene, camera);
    setIsSceneReady(true);
    wakeLoop();

    // Pause rendering when viewer scrolls out of viewport
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'function') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isInViewport = entry.isIntersecting;
            if (entry.isIntersecting) {
              wakeLoop();
            } else if (isLoopRunning) {
              cancelAnimationFrame(frameId);
              clearTimeout(frameId);
              isLoopRunning = false;
            }
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    // Pause rendering when browser tab is inactive
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        wakeLoop();
      } else if (isLoopRunning) {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        isLoopRunning = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic ResizeObserver (debounced slightly for smooth mobile address-bar resize)
    let lastWidth = width;
    let lastHeight = height;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          if (w > 0 && h > 0 && (Math.abs(w - lastWidth) > 1 || Math.abs(h - lastHeight) > 1)) {
            lastWidth = w;
            lastHeight = h;
            renderer.setSize(w, h);
            syncCameraTargets(activePresetRef.current, !isCameraTransitioningRef.current);
            renderer.render(scene, camera);
          }
        }
      });
      resizeObserver.observe(container);
    }

    // Full Deterministic Cleanup on Unmount
    return () => {
      wakeRenderLoopRef.current = null;
      updateCameraTargetsRef.current = null;
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      isLoopRunning = false;
      controls.dispose();

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      geometriesToDispose.clear();
      materialsToDispose.clear();

      envTarget.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [computePresetVectors]);

  // Camera presets handler
  const setCameraPreset = (preset: CameraPresetType) => {
    setActivePreset(preset);
    activePresetRef.current = preset;
    updateCameraTargetsRef.current?.(preset, false);
    wakeRenderLoopRef.current?.();
  };

  // Toggle automatic demonstration
  const handleToggleAutoCycle = () => {
    const nextState = !isAutoCycle;
    setIsAutoCycle(nextState);
    isAutoCycleRef.current = nextState;
    wakeRenderLoopRef.current?.();
  };

  // Toggle 360 rotation
  const handleToggleRotation = () => {
    const nextState = !isRotating;
    setIsRotating(nextState);
    isRotatingRef.current = nextState;
    wakeRenderLoopRef.current?.();
  };

  // Direct slider handler
  const handleSliderChange = (value: number) => {
    if (isAutoCycleRef.current) {
      setIsAutoCycle(false);
      isAutoCycleRef.current = false;
    }
    cycleProgressRef.current = value;
    setCycleProgress(value);
    wakeRenderLoopRef.current?.();
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
    <RevealSection
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
            className={`p-1.5 rounded-xl border grid grid-cols-2 sm:flex items-center gap-1.5 shadow-lg ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-300'
            }`}
            role="radiogroup"
            aria-label="Seleção do Modelo 3D"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedModel === 'guincho-leve'}
              onClick={() => setSelectedModel('guincho-leve')}
              className={`btn-3d flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                selectedModel === 'guincho-leve'
                  ? 'bg-[#B43034] text-white shadow-md'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Guincho Leve</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={selectedModel === 'cavalo-1635'}
              onClick={() => setSelectedModel('cavalo-1635')}
              className={`btn-3d flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                selectedModel === 'cavalo-1635'
                  ? 'bg-[#B43034] text-white shadow-md'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Cavalo 1635</span>
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
            <strong>Nota de Transparência:</strong> Os modelos 3D exibidos abaixo são{' '}
            <em>representações conceituais e ilustrativas</em> construídas para demonstrar
            visualmente a movimentação de uma plataforma e de um cavalo mecânico, não constituindo
            réplicas técnicas exatas dos veículos da empresa.
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
          {/* Clean Status Header Bar Above Canvas (No Interactive Overlays on Canvas) */}
          <div
            className={`flex items-center justify-between gap-2 px-3.5 sm:px-5 py-2.5 border-b text-xs ${
              isDarkMode
                ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#B43034] shrink-0" />
              <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs truncate font-heading">
                {selectedModel === 'guincho-leve'
                  ? `Ilustração: Guincho Leve • ${status.badge}`
                  : 'Ilustração: Cavalo Mecânico Pesado 1635'}
              </span>
            </div>

            <span
              className={`text-[11px] font-medium flex items-center gap-1.5 shrink-0 ${
                isDarkMode ? 'text-neutral-400' : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#B43034]" />
              <span className="hidden xs:inline">Arraste para girar 360°</span>
              <span className="xs:hidden">Toque e gire</span>
            </span>
          </div>

          {/* WebGL Canvas Viewport Area — Dynamic responsive height & 100% free of overlaid buttons */}
          <div className="relative w-full h-[clamp(300px,48svh,430px)] sm:h-[clamp(400px,56vh,520px)] lg:h-[540px] overflow-hidden select-none">
            {webGlSupported ? (
              <>
                <div
                  ref={mountRef}
                  className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                />
                {showSceneSpinner && (
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs pointer-events-none ${
                      isDarkMode ? 'bg-neutral-950/85' : 'bg-slate-100/85'
                    }`}
                  >
                    <BrandSpinner
                      label="Carregando demonstração interativa 3D da frota..."
                      caption="Carregando visualização 3D..."
                      size="lg"
                      tone="auto"
                    />
                  </div>
                )}
              </>
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
                  Seu dispositivo ou navegador não possui suporte ativo para aceleração 3D WebGL.
                  Você pode conferir nossas fotografias reais da frota na galeria logo acima.
                </p>
              </div>
            )}
          </div>

          {/* Unified Control Deck Positioned Below the 3D Model (Zero Overlay on Canvas) */}
          <div
            className={`w-full border-t p-3.5 sm:p-5 space-y-4 z-10 transition-colors duration-300 ${
              isDarkMode ? 'bg-neutral-900/95 border-neutral-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Primary Action Bar Below Model: Automatic Demonstration, 360° Rotation & Camera Angles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-neutral-800">
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleAutoCycle}
                  aria-pressed={isAutoCycle}
                  className={`btn-3d flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    isAutoCycle
                      ? 'bg-[#B43034] text-white border-[#B43034] shadow-md'
                      : isDarkMode
                      ? 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
                  }`}
                  title={
                    isAutoCycle
                      ? 'Pausar demonstração automática'
                      : 'Iniciar demonstração automática'
                  }
                >
                  {isAutoCycle ? (
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                  )}
                  <span>{isAutoCycle ? 'Pausar Demo' : 'Demonstrar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleRotation}
                  aria-pressed={isRotating}
                  className={`btn-3d flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    isRotating
                      ? isDarkMode
                        ? 'bg-neutral-800 border-neutral-600 text-white'
                        : 'bg-slate-200 border-slate-400 text-slate-900'
                      : isDarkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isRotating ? 'Pausar giro 360°' : 'Ativar giro 360° contínuo'}
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                  <span>Giro 360°: {isRotating ? 'Ativo' : 'Pausado'}</span>
                </button>
              </div>

              {/* Camera Angle Selector (Available for both models below canvas) */}
              <div
                className={`flex items-center justify-between sm:justify-end gap-1 p-1 rounded-lg border font-heading ${
                  isDarkMode
                    ? 'bg-neutral-950 border-neutral-800'
                    : 'bg-white border-slate-300 shadow-xs'
                }`}
              >
                <span
                  className={`text-[10px] uppercase px-2 font-bold ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                >
                  Câmera:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCameraPreset('geral')}
                    className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      activePreset === 'geral'
                        ? 'bg-[#B43034] text-white'
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
                    className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      activePreset === 'plataforma'
                        ? 'bg-[#B43034] text-white'
                        : isDarkMode
                        ? 'text-neutral-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {selectedModel === 'guincho-leve' ? 'Rampa' : 'Quinta Roda'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('cabine')}
                    className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      activePreset === 'cabine'
                        ? 'bg-[#B43034] text-white'
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
                      <span className="font-bold uppercase tracking-wider font-heading">
                        {status.phase}
                      </span>
                    </div>
                    <span className="text-neutral-500 hidden sm:inline">—</span>
                    <span className="text-[11px] sm:text-xs pl-4 sm:pl-0">{status.detail}</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#B43034] bg-red-950/20 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30 shrink-0 self-start sm:self-auto">
                    SIMULAÇÃO ILUSTRATIVA
                  </div>
                </div>

                {/* Ramp Slider & Step Presets */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider font-heading">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#B43034]" />
                      <span>Controle Ilustrativo da Rampa:</span>
                    </span>
                    <span ref={progressTextRef} className="font-mono text-[11px]">
                      {cycleProgress <= 35
                        ? `Etapa 1: Recuo (${cycleProgress}%)`
                        : `Etapa 2: Inclinação (${cycleProgress}%)`}
                    </span>
                  </div>

                  <input
                    ref={sliderInputRef}
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={cycleProgress}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full accent-[#B43034] h-2.5 rounded-lg cursor-pointer"
                    aria-label="Controle ilustrativo da posição da rampa"
                    title="Controle ilustrativo da posição da rampa"
                  />

                  {/* Step presets */}
                  <div className="grid grid-cols-3 gap-2 pt-1 font-heading">
                    <button
                      type="button"
                      onClick={() => {
                        if (sliderInputRef.current) sliderInputRef.current.value = '0';
                        handleSliderChange(0);
                      }}
                      className={`text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors text-center cursor-pointer ${
                        cycleProgress === 0
                          ? 'bg-[#B43034] text-white border-[#B43034]'
                          : isDarkMode
                          ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                          : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      Posição Trânsito (0%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (sliderInputRef.current) sliderInputRef.current.value = '35';
                        handleSliderChange(35);
                      }}
                      className={`text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors text-center cursor-pointer ${
                        cycleProgress === 35
                          ? 'bg-[#B43034] text-white border-[#B43034]'
                          : isDarkMode
                          ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                          : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      Recuo da Prancha (35%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (sliderInputRef.current) sliderInputRef.current.value = '100';
                        handleSliderChange(100);
                      }}
                      className={`text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors text-center cursor-pointer ${
                        cycleProgress === 100
                          ? 'bg-[#B43034] text-white border-[#B43034]'
                          : isDarkMode
                          ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                          : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      Posição Embarque (100%)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Heavy Tractor Conceptual Deck (Model 2: Cavalo Mecânico) */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-neutral-950/80 border-neutral-800'
                      : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acoplamento Pesado</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Representação conceitual da quinta roda para operações de tração e deslocamento
                    pesado.
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-neutral-950/80 border-neutral-800'
                      : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Estrutura Rodoviária</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Configuração voltada ao suporte operacional de caminhões e composições sob
                    consulta.
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-neutral-950/80 border-neutral-800'
                      : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[#B43034] font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Atendimento Sob Consulta</span>
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    Consulte a equipe via WhatsApp para verificar disponibilidade e especificações
                    para sua demanda.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RevealSection>
  );
};
