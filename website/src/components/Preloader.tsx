import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const bootLines = [
  '[BOOT] INITIALIZING CORNELCLOUD ENGINE...',
  '[OK]   VITE v8.0.14 ENVIRONMENT REGISTERED',
  '[OK]   AWS SOLUTIONS ARCHITECT CREDENTIALS PARSED',
  '[OK]   3D WEBGL GRAPHICS ENVIRONMENT INJECTED',
  '[OK]   GLSL LIQUID DATA SHADERS COMPILED',
  '[BOOT] COMPILING ARCHITECTURE GRAPH [100%]',
  '[BOOT] DEPLOYMENT COMPLETE. STARTING EXPERIENCE...'
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Lock scrolling on boot
    document.body.style.overflow = 'hidden';
    
    // Smooth loader percentage updates
    const percentInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(percentInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 4;
      });
    }, 100);

    let index = 0;
    let timerId: any;

    const printNextLine = () => {
      if (index < bootLines.length) {
        const lineToAdd = bootLines[index];
        setLines((prev) => [...prev, lineToAdd]);
        const delay = index === 0 ? 150 : index === 5 ? 1000 : 350;
        index++;
        timerId = setTimeout(printNextLine, delay);
      } else {
        timerId = setTimeout(() => {
          document.body.style.overflow = 'unset';
          onComplete();
        }, 800);
      }
    };
    
    timerId = setTimeout(printNextLine, 150);

    return () => {
      clearInterval(percentInterval);
      clearTimeout(timerId);
    };
  }, []); // Run exactly once on mount, preventing re-render clear resets

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: '-100vh', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col justify-between p-8 font-mono select-none"
    >
      <div className="text-[9px] text-[#6b7280] flex justify-between uppercase tracking-wider">
        <span>CORNELCLOUD CORE v4.2 // BOOT SEQUENCE</span>
        <span>SYS.OK</span>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full text-left space-y-2">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-xs md:text-sm tracking-wide ${
              line && line.includes('[OK]') 
                ? 'text-[#00FFD1]' 
                : line && line.includes('[BOOT]') && line.includes('100%')
                  ? 'text-[#8B5CF6] font-bold'
                  : 'text-[#e8eaed]'
            }`}
          >
            {line}
          </motion.div>
        ))}
        {lines.length >= 6 && (
          <div className="w-full bg-white/5 h-1 rounded overflow-hidden mt-6">
            <motion.div 
              className="bg-[#00FFD1] h-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>

      <div className="text-[9px] text-[#6b7280] flex justify-between uppercase tracking-wider">
        <span>INTELLIGENT SYSTEMS: COMPILING</span>
        <span>{percent}% MOUNTED</span>
      </div>
    </motion.div>
  );
}
