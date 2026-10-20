import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Github, Linkedin, Instagram } from './BrandIcons';
import { profile } from '../config/profile';

const currentYear = new Date().getFullYear();

const isConfigured = (value, placeholder) => Boolean(value) && value !== placeholder;

const footerLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' }
];

const socialItems = [
  { label: 'LinkedIn', href: isConfigured(profile.linkedin, 'YOUR_LINKEDIN_URL') ? profile.linkedin : null, Icon: Linkedin },
  { label: 'GitHub', href: isConfigured(profile.github, 'YOUR_GITHUB_URL') ? profile.github : null, Icon: Github },
  { label: 'Instagram', href: isConfigured(profile.instagram, 'YOUR_INSTAGRAM_URL') ? profile.instagram : null, Icon: Instagram },
  { label: 'Email', href: isConfigured(profile.email, 'YOUR_EMAIL') ? `mailto:${profile.email}` : null, Icon: Mail }
];

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container footer-container'>
        <motion.div
          className='footer-brand'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className='logo-text gradient-text'>{profile.shortName}</span>
          <p>{profile.description}</p>
        </motion.div>

        <motion.nav
          className='footer-links'
          aria-label='Footer navigation'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {footerLinks.map((link) => (
            <a key={link.name} href={link.href} className='footer-link'>
              {link.name}
            </a>
          ))}
        </motion.nav>

        <motion.div
          className='footer-socials'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {socialItems
            .filter((item) => item.href)
            .map(({ label, href, Icon }) => (
              <a key={label} href={href} className='footer-social' target={href.startsWith('mailto:') ? undefined : '_blank'} rel='noopener noreferrer' aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
        </motion.div>
      </div>

      <div className='footer-bottom'>
        <div className='container footer-bottom-inner'>
          <span>
            &copy; {currentYear} {profile.name}. All rights reserved.
          </span>
          <span className='footer-made'>Built with React &amp; Framer Motion</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;