import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface ServerNode {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  size: number;
}

const nodesData: ServerNode[] = [
  { id: 'alb', name: 'ALB', position: [0, 3, 0], color: '#4DA3FF', size: 0.3 },
  { id: 'web', name: 'Web Server', position: [-2, 1.5, 0.5], color: '#00FFD1', size: 0.25 },
  { id: 'app1', name: 'ECS Service', position: [-1, -0.5, 1], color: '#8B5CF6', size: 0.25 },
  { id: 'app2', name: 'Bedrock API', position: [1.8, 1, -1], color: '#8B5CF6', size: 0.25 },
  { id: 'lambda', name: 'Lambda Engine', position: [2.5, -1, 1], color: '#ff6b35', size: 0.2 },
  { id: 'rds', name: 'Aurora DB', position: [0, -2.5, 0], color: '#00FFD1', size: 0.35 },
  { id: 's3', name: 'S3 Storage', position: [-2.5, -2, -1], color: '#4DA3FF', size: 0.3 }
];

// Node-to-node line connection maps
const connections = [
  ['alb', 'web'],
  ['web', 'app1'],
  ['alb', 'app2'],
  ['app2', 'lambda'],
  ['app1', 'rds'],
  ['lambda', 'rds'],
  ['s3', 'rds'],
  ['app1', 's3']
];

function NodeMesh({ node }: { node: ServerNode }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Pulse scale slowly
    const scale = 1 + Math.sin(time * 3 + node.position[0]) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
    
    // Rotate wireframe cage
    wireframeRef.current.rotation.y = time * 0.5;
    wireframeRef.current.rotation.x = time * 0.2;
  });

  return (
    <group position={node.position}>
      {/* Central Solid Node */}
      <mesh ref={meshRef}>
        <boxGeometry args={[node.size, node.size, node.size]} />
        <meshBasicMaterial color={node.color} />
      </mesh>
      
      {/* Outer Rotating Wireframe Cage */}
      <mesh ref={wireframeRef}>
        <boxGeometry args={[node.size * 1.6, node.size * 1.6, node.size * 1.6]} />
        <meshBasicMaterial color={node.color} wireframe transparent opacity={0.35} />
      </mesh>

      {/* Subtle Glow Aura */}
      <mesh scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[node.size, 8, 8]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Data Packet particle flowing between connected nodes
interface Packet {
  pos: THREE.Vector3;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
  speed: number;
  color: string;
}

export function CloudNetwork() {
  const groupRef = useRef<THREE.Group | null>(null);
  
  // Map node positions for quick lookup
  const nodePositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodesData.forEach(node => {
      map.set(node.id, new THREE.Vector3(...node.position));
    });
    return map;
  }, []);

  // Compute connections coordinates
  const linePaths = useMemo(() => {
    return connections.map(([startId, endId]) => {
      const start = nodePositions.get(startId);
      const end = nodePositions.get(endId);
      if (start && end) {
        return [start, end];
      }
      return null;
    }).filter(p => p !== null) as [THREE.Vector3, THREE.Vector3][];
  }, [nodePositions]);

  // Instantiate flow packets
  const packets = useMemo(() => {
    const list: Packet[] = [];
    linePaths.forEach(([start, end], idx) => {
      const node = nodesData.find(n => n.id === connections[idx][0]);
      list.push({
        pos: start.clone(),
        start,
        end,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.15,
        color: node ? node.color : '#00FFD1'
      });
    });
    return list;
  }, [linePaths]);

  const packetRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Scroll-driven camera position interpolations
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / (maxScroll || 1);

    // Dynamic camera camera paths based on scroll depths
    const targetCamX = Math.sin(scrollProgress * Math.PI * 0.8) * 4.5 + Math.sin(time * 0.08) * 0.5;
    const targetCamY = 3.5 - scrollProgress * 7.5;
    const targetCamZ = 6.5 - scrollProgress * 3.5 + Math.cos(time * 0.08) * 0.5;

    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);

    // Slowly rotate the entire network group
    groupRef.current.rotation.y = time * 0.02;

    // Animate flow packets
    packets.forEach((packet, idx) => {
      packet.progress += delta * packet.speed;
      if (packet.progress >= 1.0) {
        packet.progress = 0;
      }
      
      // Interpolate position along line path
      packet.pos.lerpVectors(packet.start, packet.end, packet.progress);
      
      const mesh = packetRefs.current[idx];
      if (mesh) {
        mesh.position.copy(packet.pos);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Subtle Holographic Grid Floor */}
      <group position={[0, -3.2, 0]}>
        <Grid
          position={[0, 0, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#171A21"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#4DA3FF"
          fadeDistance={18}
          infiniteGrid
        />
      </group>

      {/* Render Server Nodes */}
      {nodesData.map((node) => (
        <NodeMesh key={node.id} node={node} />
      ))}

      {/* Render Connection Lines */}
      {linePaths.map(([start, end], idx) => (
        <Line
          key={idx}
          points={[start, end]}
          color="#171A21"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}

      {/* Render Flow Packet Mesh */}
      {packets.map((packet, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) packetRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={packet.color} />
        </mesh>
      ))}

      {/* Ambient background dust particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              useMemo(() => {
                const arr = new Float32Array(300 * 3);
                for (let i = 0; i < 300; i++) {
                  arr[i * 3] = (Math.random() - 0.5) * 15;
                  arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
                  arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
                }
                return arr;
              }, []),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#4DA3FF" transparent opacity={0.15} sizeAttenuation />
      </points>
    </group>
  );
}
