import { renderToStaticMarkup } from 'react-dom/server';
import { QRCodeSVG } from 'qrcode.react';
import { profile } from '../config/profile';
import Lanyard from './Lanyard';
import { Github, Instagram, Linkedin } from './BrandIcons';
import { Mail } from 'lucide-react';

const isConfigured = (value, placeholder) => Boolean(value) && value !== placeholder;

const escapeXml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  })[character]);

const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const patternedStrap = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="320" viewBox="0 0 96 320">
    <rect width="96" height="320" fill="#172326"/>
    <path d="M8 0v320M88 0v320" stroke="#e4b965" stroke-opacity=".7" stroke-width="2"/>
    <path d="m48 8 27 24-27 24-27-24L48 8Zm0 64 27 24-27 24-27-24 27-24Zm0 64 27 24-27 24-27-24 27-24Zm0 64 27 24-27 24-27-24 27-24Zm0 64 27 24-27 24-27-24 27-24Z" fill="none" stroke="#e4b965" stroke-opacity=".82" stroke-width="3"/>
    <circle cx="48" cy="32" r="4" fill="#f5d99b"/>
    <circle cx="48" cy="96" r="4" fill="#f5d99b"/>
    <circle cx="48" cy="160" r="4" fill="#f5d99b"/>
    <circle cx="48" cy="224" r="4" fill="#f5d99b"/>
    <circle cx="48" cy="288" r="4" fill="#f5d99b"/>
  </svg>
`);

const githubArtwork = () => {
  const githubUrl = isConfigured(profile.github, 'YOUR_GITHUB_URL')
    ? profile.github
    : 'https://github.com/Fachriza401';
  const qrMarkup = renderToStaticMarkup(
    <QRCodeSVG value={githubUrl} size={280} level='H' bgColor='#ffffff' fgColor='#142229' />
  );
  const qrGraphic = qrMarkup.replace(
    /<svg\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/,
    '<svg x="160" y="258" width="280" height="280" viewBox="$1">$2</svg>'
  );

  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1e343a"/>
          <stop offset="1" stop-color="#101719"/>
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#background)"/>
      <rect x="24" y="24" width="552" height="852" rx="24" fill="none" stroke="#d3e2dc" stroke-opacity=".52" stroke-width="7"/>
      <text x="300" y="124" fill="#ffd21f" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="4" text-anchor="middle">SCAN TO VISIT</text>
      <text x="300" y="174" fill="#f4f7f5" font-family="Arial,sans-serif" font-size="34" font-weight="800" text-anchor="middle">MY GITHUB</text>
      <rect x="148" y="246" width="304" height="304" rx="18" fill="#fff"/>
      ${qrGraphic}
      <text x="300" y="638" fill="#f4f7f5" font-family="Arial,sans-serif" font-size="21" font-weight="600" text-anchor="middle">${escapeXml(githubUrl)}</text>
      <path d="M48 700h504" stroke="#ffd21f" stroke-opacity=".55" stroke-width="2"/>
      <text x="300" y="766" fill="#afc0ba" font-family="Arial,sans-serif" font-size="21" text-anchor="middle">${escapeXml(profile.name)}</text>
      <text x="300" y="822" fill="#afc0ba" font-family="monospace" font-size="16" text-anchor="middle">${escapeXml(profile.id)}</text>
    </svg>
  `);
};

const githubBackArtwork = githubArtwork();

const socialLinks = [
  { label: 'Email', href: isConfigured(profile.email, 'YOUR_EMAIL') ? `mailto:${profile.email}` : null, Icon: Mail },
  { label: 'LinkedIn', href: isConfigured(profile.linkedin, 'YOUR_LINKEDIN_URL') ? profile.linkedin : null, Icon: Linkedin },
  { label: 'GitHub', href: isConfigured(profile.github, 'YOUR_GITHUB_URL') ? profile.github : null, Icon: Github },
  { label: 'Instagram', href: isConfigured(profile.instagram, 'YOUR_INSTAGRAM_URL') ? profile.instagram : null, Icon: Instagram }
];

const IdentityCard = () => (
  <div className='card-wrapper'>
    <Lanyard
      frontImage={profile.profileImage}
      backImage={githubBackArtwork}
      imageFit='cover'
      cardColor='#f5f7f4'
      className='identity-lanyard'
      size={0.64}
      strapLength={0.58}
      strapImage={patternedStrap}
      strapColor='#172326'
      metal='gold'
      finish='glossy'
      breeze={0.2}
    />
    <p className='card-hint'>Tarik kartu untuk mengayunkannya, lalu klik untuk menampilkan barcode GitHub</p>
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
