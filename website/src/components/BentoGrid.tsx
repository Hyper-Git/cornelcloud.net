import React, { useRef, useState } from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: string;
}

export function BentoCard({ children, className = '', span = 'col-span-1' }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-3xl overflow-hidden glass-card glass-card-glow p-8 transition-all duration-300 hover:border-accentCyan/30 ${span} ${className}`}
    >
      {/* Spotlight glow effect */}
      {hovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-500 rounded-full"
          style={{
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.07) 0%, rgba(124, 58, 237, 0.02) 50%, transparent 70%)',
            left: `${coords.x - 160}px`,
            top: `${coords.y - 160}px`,
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export function BentoGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}
