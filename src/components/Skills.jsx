import { motion } from 'framer-motion';
import { PanelsTopLeft, Sparkles } from 'lucide-react';
import {
  siCss,
  siDart,
  siFigma,
  siFlutter,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siLaravel,
  siMysql,
  siPhp,
  siReact,
  siVite
} from 'simple-icons';
import { skills } from '../data/skills';
import SectionTitle from './SectionTitle';

const skillLogos = {
  Laravel: siLaravel,
  PHP: siPhp,
  MySQL: siMysql,
  JavaScript: siJavascript,
  React: siReact,
  Vite: siVite,
  Flutter: siFlutter,
  Dart: siDart,
  HTML: siHtml5,
  CSS: siCss,
  Git: siGit,
  GitHub: siGithub,
  Figma: siFigma,
  'UI/UX': PanelsTopLeft,
  'AI Tools': Sparkles
};

const hasLogo = (logo) =>
  typeof logo === 'function' || (typeof logo?.path === 'string' && logo.path.trim().length > 0);

const Skills = () => {
  const visibleSkills = skills.filter((skill) => hasLogo(skillLogos[skill]));

  return (
    <section id='skills' className='section skills-section'>
      <div className='container'>
        <SectionTitle title='Skills & Technologies' subtitle='What I work with' />
        <div className='skills-grid'>
          {visibleSkills.map((skill, index) => {
            const Logo = skillLogos[skill];

            return (
              <motion.div
                key={skill}
                className='skill-card'
                role='img'
                aria-label={skill}
                title={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                {typeof Logo === 'function' ? (
                  <Logo className='skill-logo skill-logo-generic' size={42} strokeWidth={1.8} />
                ) : (
                  <svg
                    className='skill-logo'
                    role='img'
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    width='42'
                    height='42'
                    fill={`#${Logo.hex}`}
                  >
                    <path d={Logo.path} />
                  </svg>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
