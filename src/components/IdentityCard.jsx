import { profile } from '../config/profile';
import Lanyard from './Lanyard';
import { Github, Instagram, Linkedin } from './BrandIcons';
import { Mail } from 'lucide-react';

const isConfigured = (value, placeholder) => Boolean(value) && value !== placeholder;

const socialLinks = [
  { label: 'Email', href: isConfigured(profile.email, 'YOUR_EMAIL') ? `mailto:${profile.email}` : null, Icon: Mail },
  { label: 'LinkedIn', href: isConfigured(profile.linkedin, 'YOUR_LINKEDIN_URL') ? profile.linkedin : null, Icon: Linkedin },
  { label: 'GitHub', href: isConfigured(profile.github, 'YOUR_GITHUB_URL') ? profile.github : null, Icon: Github },
  { label: 'Instagram', href: isConfigured(profile.instagram, 'YOUR_INSTAGRAM_URL') ? profile.instagram : null, Icon: Instagram }
];

const IdentityCard = () => (
  <div className='card-wrapper'>
    <Lanyard
      frontImage='/images/identity-card-front.png'
      backImage='/images/identity-card-back.png'
      imageFit='cover'
      cardColor='#f5f7f4'
      className='identity-lanyard'
      size={0.64}
      strapLength={0.58}
      strapColor='#172326'
      strapLabel='FACHRIZA'
      metal='silver'
      finish='glossy'
      breeze={0.2}
    />
    <p className='card-hint'>Tarik kartu untuk mengayunkannya, lalu klik untuk melihat sisi belakang kartu</p>
    <div className='card-social-links' aria-label='Tautan sosial'>
      {socialLinks.map(({ label, href, Icon }) =>
        href ? (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel='noopener noreferrer'
            aria-label={label}
            title={label}
          >
            <Icon size={18} />
          </a>
        ) : null
      )}
    </div>
  </div>
);

export default IdentityCard;
