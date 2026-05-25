import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'text'>('default');
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 350, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (hoveredEl && hoveredEl.getAttribute('data-magnetic') === 'true') {
        const rect = hoveredEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Pull cursor center toward target center with inertia
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        cursorX.set(centerX + distanceX * 0.25);
        cursorY.set(centerY + distanceY * 0.25);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('.interactive-hover, a, button, input, textarea, [role="button"]');
      if (interactive) {
        setHoveredEl(interactive as HTMLElement);
        if (interactive.tagName === 'INPUT' || interactive.tagName === 'TEXTAREA') {
          setCursorType('text');
        } else {
          setCursorType('hover');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('.interactive-hover, a, button, input, textarea, [role="button"]');
      if (interactive && hoveredEl === interactive) {
        setHoveredEl(null);
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hoveredEl]);

  // Dimensions of cursor circle
  const size = cursorType === 'hover' ? 44 : cursorType === 'text' ? 6 : 14;

  return (
    <motion.div
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: size,
        height: size,
        backgroundColor: cursorType === 'hover' ? 'rgba(0, 212, 255, 0.05)' : 'rgb(0, 212, 255)',
        border: cursorType === 'hover' ? '1.5px solid rgba(0, 212, 255, 0.8)' : '0px solid transparent',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.15 }}
      className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
    />
  );
}
