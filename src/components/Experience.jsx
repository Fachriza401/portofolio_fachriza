import { motion } from 'framer-motion';
import { experience } from '../data/experience';
import SectionTitle from './SectionTitle';

const Experience = () => {
  return (
    <section id='experience' className='section experience-section'>
      <div className='container'>
        <SectionTitle title='Experience' subtitle='Where I have been' />
        <div className='timeline'>
          {experience.map((item, index) => (
            <motion.div
              key={item.id}
              className='timeline-item'
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className='timeline-marker' />
              <div className='timeline-content'>
                <div className='timeline-header'>
                  <h3>{item.role}</h3>
                  <span className='timeline-period'>{item.period}</span>
                </div>
                <h4 className='timeline-company'>{item.company}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
