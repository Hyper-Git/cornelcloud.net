import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { useWebGL } from './hooks/useWebGL';
import { GlobalCanvas } from './canvas/GlobalCanvas';
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

export default function App() {
  const isWebGLSupported = useWebGL();
  const [isLoading, setIsLoading] = useState(true);

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
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Background canvas layer */}
      {isWebGLSupported ? <GlobalCanvas /> : <FallbackBG />}

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
