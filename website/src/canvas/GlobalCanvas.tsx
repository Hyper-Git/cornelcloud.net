import { Canvas } from '@react-three/fiber';
import { CloudNetwork } from './CloudNetwork';

export function GlobalCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 2.5, 6.5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true 
        }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <CloudNetwork />
      </Canvas>
    </div>
  );
}
