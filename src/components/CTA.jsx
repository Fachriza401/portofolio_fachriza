import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { profile } from '../config/profile';
import { projects } from '../data/projects';

const CTA = () => {
  const whatsappNumber = profile.whatsapp && profile.whatsapp !== 'YOUR_WHATSAPP_NUMBER'
    ? profile.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
    : null;
  const message = encodeURIComponent('Halo Fachriza, saya ingin berdiskusi tentang proyek website atau mobile app.');
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : '#contact';

  return (
    <section className='section cta-section'>
      <div className='container'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className='cta-copy'>
            <span className='cta-eyebrow'>OPEN UNTUK PROJECT</span>
            <h2>
              Ada ide website atau aplikasi?
            </h2>
            <p>
              Ceritakan kebutuhanmu. Kita bahas solusi dan langkah yang paling cocok untuk proyekmu.
            </p>

            <div className='cta-buttons'>
              <motion.a
                href={whatsappUrl}
                target={whatsappNumber ? '_blank' : undefined}
                rel={whatsappNumber ? 'noopener noreferrer' : undefined}
                className='btn btn-primary btn-large cta-primary-button'
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={19} />
                Ceritakan Proyekmu
                <ArrowRight size={17} />
              </motion.a>
              <motion.a
                href='#projects'
                className='btn btn-secondary cta-secondary-button'
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                Lihat Portfolio
              </motion.a>
            </div>
            <span className='cta-response-note'>Balas langsung lewat WhatsApp</span>
          </div>

          <motion.div
            className='cta-project-collage'
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            viewport={{ once: true }}
            aria-label='Kolase karya website dan aplikasi'
          >
            {projects.map((project) => (
              <figure className='cta-project-preview' key={project.id}>
                <img src={project.image} alt={`Tampilan proyek ${project.title}`} loading='lazy' />
                <figcaption>{project.title}</figcaption>
              </figure>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
