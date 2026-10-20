import { motion, useReducedMotion } from 'framer-motion';
import { Code, Smartphone, Palette, Database, Settings } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Services = () => {
  const shouldReduceMotion = useReducedMotion();
  const services = [
    { icon: Code, number: '01', title: 'Website Development', desc: 'Website portfolio, company profile, landing page, dashboard dan sistem informasi.' },
    { icon: Smartphone, number: '02', title: 'Mobile App', desc: 'Aplikasi Android/mobile menggunakan Flutter dan Dart.' },
    { icon: Palette, number: '03', title: 'UI/UX Design', desc: 'Desain interface modern yang fokus pada usability dan visual experience.' },
    { icon: Database, number: '04', title: 'System Information', desc: 'Sistem informasi untuk kebutuhan sekolah, bisnis dan organisasi.' },
    { icon: Settings, number: '05', title: 'Maintenance & Improvement', desc: 'Membantu memperbaiki, mengembangkan dan meningkatkan aplikasi yang sudah ada.' }
  ];
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12
      }
    }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id='services' className='section services-section'>
      <div className='container'>
        <SectionTitle title='What Can I Build For You?' subtitle='Services' />
        <motion.div
          className='services-grid'
          variants={gridVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => (
            <motion.div
              key={service.number}
              className='service-card'
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : {
                y: -7,
                borderColor: 'rgba(255, 210, 31, 0.58)',
                boxShadow: '0 16px 38px rgba(255, 210, 31, 0.1)'
              }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
            >
              <div className='service-header'>
                <span className='service-icon-wrap'>
                  <service.icon size={28} strokeWidth={1.7} aria-hidden='true' />
                </span>
                <span className='service-number'>{service.number}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
