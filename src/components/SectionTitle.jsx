import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <motion.div
      className='section-title-wrapper'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <span className='section-subtitle'>{subtitle}</span>
      <h2 className='section-title'>{title}</h2>
      <div className='section-line' />
    </motion.div>
  );
};

export default SectionTitle;
