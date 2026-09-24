import { Canvas } from '@react-three/fiber';
import { SkillsCloud } from './SkillsCloud';

export function SkillsCanvas({ onHoverSkill }: { onHoverSkill: (skill: string | null) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 6.0], fov: 60 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} />
      <SkillsCloud onHoverSkill={onHoverSkill} />
    </Canvas>
  );
}
