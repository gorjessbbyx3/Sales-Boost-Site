import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function tryCreateRenderer(): THREE.WebGLRenderer | null {
  try {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    if (!r.getContext()) { r.dispose(); return null; }
    return r;
  } catch {
    return null;
  }
}

export default function NetworkSphere3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [noWebGL, setNoWebGL] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Scene ───────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ──────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    // ── Renderer ─────────────────────────────────────────────
    const renderer = tryCreateRenderer();
    if (!renderer) { setNoWebGL(true); return; }

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Group to hold everything ─────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    // ── Wiresphere ───────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(2, 28, 28);
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wire);

    // ── Orbit ring nodes ────────────────────────────────────
    const NODE_COUNT = 60;
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const nodeGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const nodes: { mesh: THREE.Mesh; phi: number; theta: number; speed: number }[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const speed = (Math.random() - 0.5) * 0.002;
      nodes.push({ mesh, phi, theta, speed });
      group.add(mesh);
    }

    // ── Inner glowing core ───────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Core glow (larger translucent sphere)
    const glowGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    group.add(new THREE.Mesh(glowGeo, glowMat));

    // ── Data packet particles ────────────────────────────────
    const PACKET_COUNT = 25;
    const packetGeo = new THREE.SphereGeometry(0.025, 4, 4);
    type Packet = {
      mesh: THREE.Mesh;
      fromIdx: number;
      toIdx: number;
      t: number;
      speed: number;
    };
    const packets: Packet[] = [];
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < PACKET_COUNT; i++) {
      const mesh = new THREE.Mesh(packetGeo, packetMat.clone());
      const fromIdx = Math.floor(Math.random() * NODE_COUNT);
      let toIdx = Math.floor(Math.random() * NODE_COUNT);
      while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * NODE_COUNT);
      packets.push({
        mesh,
        fromIdx,
        toIdx,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
      });
      group.add(mesh);
    }

    // ── Connection lines (dynamic) ────────────────────────────
    const LINE_COUNT = 20;
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
    });
    const lines: THREE.Line[] = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
      const line = new THREE.Line(geo, lineMat.clone());
      lines.push(line);
      group.add(line);
    }

    // ── Mouse tracking ────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMouseMove);

    // ── Helpers ───────────────────────────────────────────────
    const spherePos = (phi: number, theta: number, r = 2) =>
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );

    const targetRot = { x: 0, y: 0 };
    let t = 0;

    // ── Animation loop ────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.006;

      // Mouse-driven rotation with inertia
      targetRot.x += (mouseRef.current.y * 0.4 - targetRot.x) * 0.04;
      targetRot.y += (mouseRef.current.x * 0.4 - targetRot.y) * 0.04;

      group.rotation.x = targetRot.x;
      group.rotation.y = t * 0.08 + targetRot.y;

      // Update node positions
      nodes.forEach((n, i) => {
        n.theta += n.speed;
        const pos = spherePos(n.phi, n.theta + t * 0.01);
        n.mesh.position.copy(pos);

        // Pulse opacity
        const mat = n.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + 0.5 * Math.sin(t * 2 + i);
      });

      // Update connection lines
      lines.forEach((line, i) => {
        const aIdx = (i * 3) % NODE_COUNT;
        const bIdx = (i * 7 + 11) % NODE_COUNT;
        const posA = nodes[aIdx].mesh.position;
        const posB = nodes[bIdx].mesh.position;
        const pts = [posA.clone(), posB.clone()];
        line.geometry.setFromPoints(pts);
        (line.material as THREE.LineBasicMaterial).opacity =
          0.1 + 0.15 * Math.abs(Math.sin(t + i));
      });

      // Update data packets
      packets.forEach((p) => {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.fromIdx = p.toIdx;
          let newTo = Math.floor(Math.random() * NODE_COUNT);
          while (newTo === p.fromIdx) newTo = Math.floor(Math.random() * NODE_COUNT);
          p.toIdx = newTo;
        }
        const from = nodes[p.fromIdx].mesh.position;
        const to = nodes[p.toIdx].mesh.position;
        p.mesh.position.lerpVectors(from, to, p.t);
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(p.t * Math.PI) * 0.9;
      });

      // Core pulse
      const s = 1 + 0.08 * Math.sin(t * 2.5);
      core.scale.setScalar(s);

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
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  if (noWebGL) return null;

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      data-testid="canvas-network-sphere"
    />
  );
}
