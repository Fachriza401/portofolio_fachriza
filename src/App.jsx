import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CertificateGallery from './components/CertificateGallery';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Services from './components/Services';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import MeteorBackground from './components/MeteorBackground';
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Keep the selected theme for the current session when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const glow = document.getElementById('cursor-glow');
    
    const moveCursor = (e) => {
      if (window.innerWidth <= 768) return;
      if (cursor && glow) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="app">
      <div id="cursor" className="cursor" />
      <div id="cursor-glow" className="cursor-glow" />
      <MeteorBackground />
      <Navbar theme={theme} onThemeChange={setTheme} />
      <Hero />
      <About />
      <CertificateGallery />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <CTA />
      <Contact />
      <Footer />
      <FloatingContact />
    </div>
  );
}

export default App;
