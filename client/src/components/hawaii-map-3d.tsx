import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import * as THREE from "three";

interface IslandDef {
  slug: string;
  name: string;
  tagline: string;
  color: number;
  glowColor: string;
  // normalized x,y position in map space [-1,1]
  x: number;
  y: number;
  scale: number;
  shape: [number, number][];
}

const ISLANDS: IslandDef[] = [
  {
    // Kaua'i — roughly circular, cliffs on northwest coast
    slug: "kauai",
    name: "Kaua'i",
    tagline: "Garden Isle",
    color: 0x10b981,
    glowColor: "#10b981",
    x: -3.0,
    y: 0.4,
    scale: 0.72,
    shape: [
      [0.0,  1.0],
      [0.55, 0.85],
      [0.9,  0.4],
      [1.0, -0.05],
      [0.75,-0.6],
      [0.3, -1.0],
      [-0.2,-0.95],
      [-0.7,-0.65],
      [-1.0,-0.1],
      [-0.9, 0.45],
      [-0.5, 0.85],
    ],
  },
  {
    // O'ahu — elongated NW-SE, wider in center, Ko'olau on E, Waianae on W
    // North Shore protrudes N, SE corner tapers (Diamond Head)
    slug: "oahu",
    name: "O'ahu",
    tagline: "Gathering Place",
    color: 0x3b82f6,
    glowColor: "#3b82f6",
    x: -1.2,
    y: 0.0,
    scale: 0.88,
    shape: [
      [-0.2, 1.0],  // North Shore center
      [ 0.3, 0.85], // Laie / Ko'olau N
      [ 0.7, 0.5],  // Kaneohe
      [ 1.0, 0.0],  // Waimanalo / Koko Head
      [ 0.8,-0.45], // SE tip (Diamond Head)
      [ 0.5,-0.9],  // Ewa Beach
      [ 0.0,-1.0],  // Pearl Harbor
      [-0.5,-0.8],  // Leeward
      [-1.0,-0.3],  // Kaena Pt / Waianae
      [-0.9, 0.35], // Waianae N
      [-0.5, 0.8],  // Mokuleia
    ],
  },
  {
    // Maui — iconic figure-8: West Maui (NW lobe) + Haleakalā (SE lobe) joined by isthmus
    slug: "maui",
    name: "Maui",
    tagline: "Valley Isle",
    color: 0xf59e0b,
    glowColor: "#f59e0b",
    x: 1.0,
    y: -0.15,
    scale: 1.05,
    shape: [
      // West Maui lobe (NW)
      [-0.85, 0.55],
      [-0.55, 0.95],
      [-0.1,  0.85],
      [ 0.05, 0.5],
      // Narrow isthmus
      [ 0.05, 0.2],
      [ 0.15, 0.1],
      // East Maui / Haleakalā lobe (SE) — larger
      [ 0.4,  0.35],
      [ 0.85, 0.5],
      [ 1.0,  0.15],
      [ 1.0, -0.35],
      [ 0.7, -0.95],
      [ 0.2, -1.0],
      [-0.3, -0.75],
      [-0.35,-0.3],
      // Back up through isthmus
      [-0.2,  0.1],
      [-0.15, 0.35],
      // West Maui bottom
      [-0.65,-0.0],
      [-1.0,  0.15],
    ],
  },
  {
    // Big Island — large, roughly pentagonal
    // Kohala (N), Kona coast (W), Ka'ū (S), Puna lava finger (E), Hilo (NE)
    slug: "big-island",
    name: "Big Island",
    tagline: "Hawai'i Island",
    color: 0xef4444,
    glowColor: "#ef4444",
    x: 3.0,
    y: -0.75,
    scale: 1.45,
    shape: [
      [-0.35, 1.0],  // Kohala W
      [ 0.1,  0.95], // Kohala E
      [ 0.6,  0.65], // Hilo N
      [ 1.0,  0.2],  // Puna tip (E)
      [ 0.85,-0.25], // Puna S
      [ 0.55,-0.75], // Ka'ū E
      [ 0.15,-1.0],  // Ka'ū S (South Point)
      [-0.25,-0.9],  // Ka'ū W
      [-0.8, -0.5],  // Kona S
      [-1.0, -0.0],  // Kona mid
      [-0.85, 0.5],  // Kona N
      [-0.55, 0.8],  // Kohala SW
    ],
  },
];

function buildIslandGeometry(island: IslandDef): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const pts = island.shape.map(([x, y]) => ({
    x: x * island.scale * 0.55,
    y: y * island.scale * 0.55,
  }));
  shape.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i].x, pts[i].y);
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4,
  });
}

export default function HawaiiMap3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const islandMeshesRef = useRef<THREE.Mesh[]>([]);
  const hoveredRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState<number>(-1);
  const [sdkError, setSdkError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const handleClick = useCallback(() => {
    const idx = hoveredRef.current;
    if (idx >= 0) {
      navigate(`/locations/${ISLANDS[idx].slug}`);
    }
  }, [navigate]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040d1a);
    scene.fog = new THREE.FogExp2(0x040d1a, 0.06);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 5.5, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer — graceful fallback if WebGL isn't supported
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setSdkError(true);
      setLoading(false);
      return;
    }
    if (!renderer.getContext()) {
      setSdkError(true);
      setLoading(false);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ocean plane
    const oceanGeo = new THREE.PlaneGeometry(30, 30, 64, 64);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x061428,
      roughness: 0.8,
      metalness: 0.3,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // Grid lines on ocean
    const gridHelper = new THREE.GridHelper(30, 30, 0x0a2040, 0x0a2040);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // Ambient light
    const ambient = new THREE.AmbientLight(0x112244, 1.2);
    scene.add(ambient);

    // Directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 10, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Point light for atmosphere
    const ptLight = new THREE.PointLight(0x3b82f6, 1.5, 20);
    ptLight.position.set(-2, 3, 2);
    scene.add(ptLight);

    // Island meshes
    const meshes: THREE.Mesh[] = [];

    ISLANDS.forEach((island, i) => {
      const geo = buildIslandGeometry(island);
      const mat = new THREE.MeshStandardMaterial({
        color: island.color,
        roughness: 0.4,
        metalness: 0.2,
        emissive: island.color,
        emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(island.x, 0.18, island.y);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { index: i };
      scene.add(mesh);
      meshes.push(mesh);

      // Glow ring beneath island
      const ringGeo = new THREE.RingGeometry(
        island.scale * 0.55,
        island.scale * 0.75,
        32
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: island.color,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(island.x, 0.02, island.y);
      scene.add(ring);
    });

    islandMeshesRef.current = meshes;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("click", handleClick);

    // Animation
    let t = 0;
    const targetY: number[] = ISLANDS.map(() => 0.18);
    const currentY: number[] = ISLANDS.map(() => 0.18);

    setLoading(false);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.008;

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);
      const newHovered = intersects.length > 0
        ? (intersects[0].object as THREE.Mesh).userData.index
        : -1;

      if (newHovered !== hoveredRef.current) {
        hoveredRef.current = newHovered;
        setHovered(newHovered);
      }

      // Update islands
      meshes.forEach((mesh, i) => {
        const isHov = i === hoveredRef.current;
        targetY[i] = isHov ? 0.6 : 0.18;
        currentY[i] += (targetY[i] - currentY[i]) * 0.08;
        mesh.position.y = currentY[i];

        const mat = mesh.material as THREE.MeshStandardMaterial;
        const targetEmissive = isHov ? 0.7 : 0.15 + Math.sin(t + i) * 0.05;
        mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
      });

      // Gentle camera bob
      camera.position.y = 5.5 + Math.sin(t * 0.3) * 0.1;

      // Ocean wave effect via grid opacity
      (gridHelper.material as THREE.Material & { opacity: number }).opacity =
        0.3 + Math.sin(t * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("click", handleClick);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [handleClick]);

  const island = hovered >= 0 ? ISLANDS[hovered] : null;

  // Fallback: card-based island selector when WebGL isn't available
  if (sdkError) {
    return (
      <div className="w-full p-6 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ minHeight: "220px" }}>
        {ISLANDS.map((isl) => (
          <button
            key={isl.slug}
            data-testid={`button-island-${isl.slug}`}
            onClick={() => navigate(`/locations/${isl.slug}`)}
            className="group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(4,13,26,0.8)",
              borderColor: isl.glowColor + "40",
            }}
          >
            <span
              className="block w-3 h-3 rounded-full mb-3"
              style={{ background: isl.glowColor, boxShadow: `0 0 10px ${isl.glowColor}` }}
            />
            <p className="text-sm font-bold text-white">{isl.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{isl.tagline}</p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "420px" }}>
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ cursor: hovered >= 0 ? "pointer" : "default" }}
        data-testid="canvas-hawaii-map"
      />

      {/* Island label tooltip */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          island ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {island && (
          <div
            className="px-5 py-3 rounded-xl border text-center"
            style={{
              background: "rgba(4,13,26,0.85)",
              borderColor: island.glowColor + "60",
              boxShadow: `0 0 24px ${island.glowColor}30`,
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              className="text-base font-bold"
              style={{ color: island.glowColor }}
              data-testid="text-island-name"
            >
              {island.name}
            </p>
            <p className="text-xs text-white/50 mt-0.5">{island.tagline} · Click to explore</p>
          </div>
        )}
      </div>

      {/* Island dots legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5">
        {ISLANDS.map((isl, i) => (
          <button
            key={isl.slug}
            data-testid={`button-island-${isl.slug}`}
            onClick={() => navigate(`/locations/${isl.slug}`)}
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: isl.glowColor, boxShadow: `0 0 6px ${isl.glowColor}` }}
            />
            {isl.name}
          </button>
        ))}
      </div>

      {/* Instruction hint */}
      <p className="absolute bottom-4 right-4 text-[10px] text-white/25 pointer-events-none">
        Hover an island to explore
      </p>
    </div>
  );
}
