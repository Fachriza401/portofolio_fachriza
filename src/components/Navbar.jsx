import { motion } from 'framer-motion';
import { Menu, X, Download, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { profile } from '../config/profile';

const Navbar = ({ theme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];
  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  const themeToggle = (
    <button
      type='button'
      className='theme-toggle'
      onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
      aria-label={themeLabel}
      title={themeLabel}
    >
      <ThemeIcon size={18} aria-hidden='true' />
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className='nav-container'>
        <motion.div whileHover={{ scale: 1.05 }} className='nav-logo'>
          <span className='logo-text'>{profile.shortName}</span>
        </motion.div>

        <div className='nav-menu'>
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className='nav-link'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.name}
            </motion.a>
          ))}
          <motion.a
            href={profile.cv}
            download='Fachriza-Taufid-CV.png'
            className='nav-cta'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            Download CV
          </motion.a>
          {themeToggle}
        </div>

        <motion.button
          type='button'
          className='hamburger'
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isOpen}
          aria-controls='mobile-navigation'
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {isOpen && (
        <motion.div
          id='mobile-navigation'
          className='mobile-menu'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className='mobile-link' onClick={() => setIsOpen(false)}>
              {item.name}
            </a>
          ))}
          <a href={profile.cv} download='Fachriza-Taufid-CV.png' className='mobile-cta' onClick={() => setIsOpen(false)}>
            <Download size={16} />
            Download CV
          </a>
          {themeToggle}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
