import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, GraduationCap, Target, Clock, Code2, Smartphone, Palette } from 'lucide-react';
import { profile } from '../config/profile';
import SectionTitle from './SectionTitle';

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const badges = [
    { label: 'Web Development', icon: Code2 },
    { label: 'Mobile App', icon: Smartphone },
    { label: 'UI/UX Design', icon: Palette }
  ];
  const cards = [
    {
      icon: GraduationCap,
      title: 'Pendidikan',
      text: profile.education.univ.school,
      detail: `${profile.education.univ.major} · Latar belakang ${profile.education.smk.major}`
    },
    {
      icon: MapPin,
      title: 'Lokasi',
      text: profile.location,
      detail: 'Berdomisili di Sumatera Utara'
    },
    {
      icon: Target,
      title: 'Fokus',
      text: 'Web, Mobile & UI/UX',
      detail: 'Membangun solusi digital yang mudah digunakan'
    },
    {
      icon: Clock,
      title: 'Ketersediaan',
      text: 'Terbuka untuk peluang',
      detail: 'Kolaborasi, proyek, dan kesempatan baru'
    }
  ];
  const contentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.55, ease: 'easeOut' }
    }
  };

  return (
    <section id='about' className='section about-section'>
      <div className='container'>
        <SectionTitle title='About Me' subtitle='Get to know me' />
        <motion.div
          className='about-grid'
          variants={contentVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div className='about-image' variants={itemVariants}>
            <div className='about-profile-frame'>
              <div className='about-profile'>
                <img src={profile.profileImage} alt={profile.name} />
                <div className='about-profile-caption'>
                  <span>Mahasiswa Sistem Informasi</span>
                  <strong>{profile.education.univ.school}</strong>
                </div>
              </div>
              <span className='about-frame-corner about-frame-corner-top' aria-hidden='true' />
              <span className='about-frame-corner about-frame-corner-bottom' aria-hidden='true' />
            </div>
            <span className='about-photo-note'>Medan, Indonesia</span>
          </motion.div>

          <motion.div className='about-content' variants={contentVariants}>
            <motion.span className='about-kicker' variants={itemVariants}>
              PROFIL SINGKAT
            </motion.span>
            <motion.h3 className='about-heading' variants={itemVariants}>
              Halo, saya <span>{profile.name.split(' ')[0]}.</span>
            </motion.h3>
            <motion.p variants={itemVariants}>
              Saya mahasiswa Sistem Informasi di {profile.education.univ.school}, dengan latar belakang
              Teknik Komputer dan Jaringan dari {profile.education.smk.school}. Perpaduan keduanya membentuk
              ketertarikan saya pada teknologi dari sisi infrastruktur hingga aplikasi.
            </motion.p>
            <motion.p variants={itemVariants}>
              Saya tertarik mengembangkan website dan aplikasi mobile, merancang pengalaman pengguna, serta
              mempelajari teknologi baru untuk membuat solusi digital yang bermanfaat.
            </motion.p>

            <motion.div className='about-badges' variants={itemVariants} aria-label='Bidang keahlian'>
              {badges.map(({ label, icon: Icon }) => (
                <span className='about-badge' key={label}>
                  <Icon size={15} aria-hidden='true' />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div className='about-cards' variants={contentVariants}>
              {cards.map(({ icon: Icon, title, text, detail }) => (
                <motion.article
                  key={title}
                  className='about-card'
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                >
                  <span className='about-card-icon'>
                    <Icon size={18} strokeWidth={1.8} aria-hidden='true' />
                  </span>
                  <div className='about-card-copy'>
                    <span className='about-card-label'>{title}</span>
                    <h4>{text}</h4>
                    <p>{detail}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
