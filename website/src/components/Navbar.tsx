import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
      let current = 'about';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 transition-all duration-300 ${
        scrolled
          ? 'bg-bgPrimary/70 backdrop-blur-xl border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollTo('about');
        }}
        className="text-lg font-mono font-medium tracking-wide text-gradient-cyan interactive-hover"
      >
        cornelcloud
      </a>

      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.id);
              }}
              className={`relative text-sm transition-colors duration-200 pb-1 interactive-hover ${
                activeSection === link.id ? 'text-textPrimary font-medium' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-gradient-to-r from-accentCyan to-accentPurple"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>

      <button
        onClick={() => scrollTo('contact')}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accentCyan to-accentPurple text-bgPrimary font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] interactive-hover"
        data-magnetic="true"
      >
        Let's Connect
      </button>
    </motion.nav>
  );
}
