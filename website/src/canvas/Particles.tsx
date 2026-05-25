import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uMouseStrength;

  varying vec2 vUv;
  varying float vDistanceToMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Organic wave animation
    float waveX = sin(pos.y * 1.5 + uTime * 0.4) * 0.25;
    float waveY = cos(pos.x * 1.5 + uTime * 0.4) * 0.25;
    pos.x += waveX;
    pos.y += waveY;
    pos.z += sin(pos.x * 2.0 + uTime * 0.5) * 0.3;

    // Scroll vertical parallax offset
    pos.y -= uScroll * 0.003;

    // Mouse interactive force (repulsion)
    // Map mouse screen coords to vertex space
    vec3 mousePos = vec3(uMouse.x * 6.0, uMouse.y * 4.0, 0.0);
    float dist = distance(pos.xyz, mousePos);
    vDistanceToMouse = dist;

    if (dist < 2.5) {
      float force = (2.5 - dist) / 2.5;
      // Push away from cursor
      vec3 direction = pos - mousePos;
      if (length(direction) > 0.0) {
        pos.xy += normalize(direction.xy) * force * uMouseStrength * 0.8;
        pos.z += force * uMouseStrength * 0.6;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation based on distance
    gl_PointSize = (9.0 + sin(uTime + pos.x * 10.0) * 2.0) * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDistanceToMouse;

  void main() {
    // Draw perfect circle particles
    float distToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distToCenter > 0.5) discard;

    float alpha = smoothstep(0.5, 0.15, distToCenter);

    // Neon Cyber-blue (#00d4ff) to turquoise/teal gradients
    vec3 baseColor = vec3(0.0, 0.45, 0.85); // Electric Blue
    vec3 hoverColor = vec3(0.0, 0.95, 0.8); // Cyber Turquoise

    // Interpolate color when mouse is near
    float colorMix = smoothstep(2.5, 0.2, vDistanceToMouse);
    vec3 finalColor = mix(baseColor, hoverColor, colorMix);

    gl_FragColor = vec4(finalColor, alpha * (0.35 + colorMix * 0.5));
  }
`;

export function Particles() {
  const pointsRef = useRef<THREE.Points | null>(null);

  const count = 2500;

  // Initial position buffers
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create a cylindrical or dispersed shell distribution
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4.5;
      
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return [pos];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uMouseStrength: { value: 0 }
  }), []);

  // Track cursor and scroll coordinates
  const mouseCoords = useRef({ x: 0, y: 0 });
  const activeMouseStrength = useRef(0);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const material = pointsRef.current.material as THREE.ShaderMaterial;

    // Interpolate mouse coordinates (inertia)
    const targetX = state.pointer.x;
    const targetY = state.pointer.y;
    mouseCoords.current.x += (targetX - mouseCoords.current.x) * 0.08;
    mouseCoords.current.y += (targetY - mouseCoords.current.y) * 0.08;

    // Calculate velocity for mouse push strength
    const dx = targetX - mouseCoords.current.x;
    const dy = targetY - mouseCoords.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // Smoothly scale cursor influence strength
    if (speed > 0.005) {
      activeMouseStrength.current += (1.0 - activeMouseStrength.current) * 0.1;
    } else {
      activeMouseStrength.current += (0.2 - activeMouseStrength.current) * 0.05;
    }

    material.uniforms.uTime.value = time;
    material.uniforms.uMouse.value.set(mouseCoords.current.x, mouseCoords.current.y);
    material.uniforms.uScroll.value = window.scrollY;
    material.uniforms.uMouseStrength.value = activeMouseStrength.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
