import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { profile } from '../config/profile';
import IdentityCard from './IdentityCard';
import PortfolioStats from './PortfolioStats';

const Hero = () => {
  return (
    <section id='home' className='hero-section'>
      <div className='hero-bg'>
        <div className='hero-grid' />
        <div className='hero-glow hero-glow-1' />
        <div className='hero-glow hero-glow-2' />
      </div>
      <div className='container hero-container'>
        <motion.div
          className='hero-content'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className='hero-greeting'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Hello, I'm
          </motion.p>
          <motion.h1
            className='hero-title'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className='hero-name'>{profile.name}</span>
          </motion.h1>
          <motion.p
            className='hero-subtitle'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {profile.title}
          </motion.p>
          <motion.p
            className='hero-description'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {profile.description}
          </motion.p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href='#projects'
              className='btn btn-primary'
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Portfolio
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href='#contact'
              className='btn btn-secondary'
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Hubungi Saya
            </motion.a>
          </motion.div>
          <PortfolioStats />
        </motion.div>
        <motion.div
          className='hero-card-section'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <IdentityCard />
        </motion.div>
      </div>
<motion.div
        className='hero-scroll'
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.8 }, y: { duration: 2, repeat: Infinity } }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
