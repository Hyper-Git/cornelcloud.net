import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  'AWS', 'Terraform', 'Lambda', 'Python', 'Docker',
  'S3', 'ECS', 'VPC', 'Bedrock', 'CI/CD',
  'GitHub Actions', 'FastAPI', 'RDS', 'DynamoDB', 'CloudFront',
  'CloudWatch', 'CloudFormation', 'IAM', 'Kubernetes', 'Serverless',
  'API Gateway', 'Route 53', 'ACM', 'EC2'
];

interface WordProps {
  children: string;
  position: THREE.Vector3;
  onHover: (skill: string | null) => void;
}

function Word({ children, position, onHover }: WordProps) {
  const textRef = useRef<THREE.Mesh | null>(null);
  const color = new THREE.Color('#00d4ff');
  const hoverColor = new THREE.Color('#8b5cf6'); // Glowing Purple on hover

  const onPointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHover(children);
    if (textRef.current) {
      // @ts-ignore
      textRef.current.material.color = hoverColor;
    }
  };

  const onPointerOut = () => {
    document.body.style.cursor = 'default';
    onHover(null);
    if (textRef.current) {
      // @ts-ignore
      textRef.current.material.color = color;
    }
  };

  return (
    <Billboard position={position}>
      <Text
        ref={textRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        fontSize={0.34}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Outfit-Regular.ttf"
      >
        {children}
      </Text>
    </Billboard>
  );
}

export function SkillsCloud({ onHoverSkill }: { onHoverSkill: (skill: string | null) => void }) {
  const groupRef = useRef<THREE.Group | null>(null);

  // Distribute skills evenly on a sphere using Fibonacci sphere algorithm
  const wordComponents = useMemo(() => {
    const radius = 3.0;
    const count = skills.length;
    const temp: { word: string; pos: THREE.Vector3 }[] = [];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      temp.push({
        word: skills[i],
        pos: new THREE.Vector3(x, y, z),
      });
    }
    return temp;
  }, []);

  // Compute glowing link lines between nodes that are close to each other
  const linePositions = useMemo(() => {
    const coords: number[] = [];
    const threshold = 2.5; // Max distance to form a link connection

    for (let i = 0; i < wordComponents.length; i++) {
      for (let j = i + 1; j < wordComponents.length; j++) {
        const p1 = wordComponents[i].pos;
        const p2 = wordComponents[j].pos;
        if (p1.distanceTo(p2) < threshold) {
          coords.push(p1.x, p1.y, p1.z);
          coords.push(p2.x, p2.y, p2.z);
        }
      }
    }
    return new Float32Array(coords);
  }, [wordComponents]);

  const targetRotation = useRef({ x: 0.002, y: 0.003 });

  useFrame((state) => {
    if (!groupRef.current) return;

    // React to cursor coordinates to drag rotation speed
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    targetRotation.current.x += (mouseY * 0.012 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (mouseX * 0.012 - targetRotation.current.y) * 0.05;

    // Apply continuous rotation plus mouse bias
    groupRef.current.rotation.x += targetRotation.current.x + 0.001;
    groupRef.current.rotation.y += targetRotation.current.y + 0.001;
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic connected link lines representing technology relations */}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00FFD1" transparent opacity={0.12} />
        </lineSegments>
      )}

      {/* Render Node Labels */}
      {wordComponents.map(({ word, pos }, index) => (
        <Word key={index} position={pos} onHover={onHoverSkill}>
          {word}
        </Word>
      ))}
    </group>
  );
}
