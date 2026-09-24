import { lazy, Suspense, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { useWebGL } from './hooks/useWebGL';
import { FallbackBG } from './components/FallbackBG';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Chatbot } from './components/Chatbot';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { AboutSystem } from './components/AboutSystem';

// three.js is ~270 KB gzipped. Loading it lazily lets the page render first
// and the 3D background appears once its chunk arrives.
const GlobalCanvas = lazy(() =>
  import('./canvas/GlobalCanvas').then((m) => ({ default: m.GlobalCanvas }))
);

// Show the boot sequence once per browser session, and never to visitors who
// have asked their OS to reduce motion
function shouldShowPreloader() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem('preloaderSeen');
  } catch {
    return true; // Storage blocked (private mode etc.) - just show it
  }
}

function markPreloaderSeen() {
  try {
    sessionStorage.setItem('preloaderSeen', '1');
  } catch {
    // Storage blocked - it will show again next time, which is fine
  }
}

export default function App() {
  const isWebGLSupported = useWebGL();
  const [isLoading, setIsLoading] = useState(shouldShowPreloader);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e8eaed] overflow-x-hidden antialiased">
      {/* Boot up Preloader */}
      <AnimatePresence>
        {isLoading && (
          <Preloader
            onComplete={() => {
              markPreloaderSeen();
              setIsLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Background canvas layer */}
      {isWebGLSupported ? (
        <Suspense fallback={null}>
          <GlobalCanvas />
        </Suspense>
      ) : (
        <FallbackBG />
      )}

      {/* Interactive Cursor */}
      <CustomCursor />

      {/* Global Navigation */}
      <Navbar />

      {/* Main content grid */}
      <main className="relative z-10">
        <Hero />
        <AboutSystem />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Floating Chat Agent */}
      <Chatbot />

      {/* Premium Footer */}
      <footer className="py-12 border-t border-white/5 bg-bgSecondary/20 text-center text-xs text-textMuted font-mono">
        <div className="text-gradient-cyan inline-block font-bold text-sm tracking-wide mb-2">
          cornelcloud
        </div>
        <p>Designed &amp; Built by Cornel Bacanu &copy; {new Date().getFullYear()} · Powered by AWS Serverless &amp; Vite</p>
      </footer>
    </div>
  );
}
