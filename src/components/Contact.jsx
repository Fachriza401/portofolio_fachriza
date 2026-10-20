import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { Github, Linkedin, Instagram } from './BrandIcons';
import { profile } from '../config/profile';
import SectionTitle from './SectionTitle';

const isConfigured = (value, placeholder) => Boolean(value) && value !== placeholder;

const whatsappNumber = isConfigured(profile.whatsapp, 'YOUR_WHATSAPP_NUMBER')
  ? profile.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  : null;

const contactItems = [
  {
    label: 'Email',
    value: isConfigured(profile.email, 'YOUR_EMAIL') ? profile.email : 'Belum diisi',
    href: isConfigured(profile.email, 'YOUR_EMAIL')
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`
      : null,
    Icon: Mail
  },
  {
    label: 'WhatsApp',
    value: whatsappNumber ? `+${whatsappNumber}` : 'Belum diisi',
    href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,
    Icon: MessageCircle
  },
  { label: 'Location', value: profile.location, href: null, Icon: MapPin }
];

const socialItems = [
  {
    label: 'LinkedIn',
    href: isConfigured(profile.linkedin, 'YOUR_LINKEDIN_URL') ? profile.linkedin : null,
    Icon: Linkedin
  },
  {
    label: 'GitHub',
    href: isConfigured(profile.github, 'YOUR_GITHUB_URL') ? profile.github : null,
    Icon: Github
  },
  {
    label: 'Instagram',
    href: isConfigured(profile.instagram, 'YOUR_INSTAGRAM_URL') ? profile.instagram : null,
    Icon: Instagram
  }
];

const EMPTY_FORM = { name: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (submissionStatus) setSubmissionStatus('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!whatsappNumber) {
      setSubmissionStatus('Nomor WhatsApp belum tersedia. Silakan hubungi melalui email.');
      return;
    }

    const message = [
      'Halo, saya menghubungi melalui portfolio.',
      '',
      `Nama: ${form.name}`,
      `Email: ${form.email}`,
      '',
      'Pesan:',
      form.message
    ].join('\n');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmissionStatus('WhatsApp dibuka dengan pesan Anda. Tekan tombol Kirim di WhatsApp untuk mengirimnya.');
  };

  const isReady = Boolean(whatsappNumber);

  return (
    <section id='contact' className='section contact-section'>
      <div className='container'>
        <SectionTitle title='Get In Touch' subtitle='Contact' />
        <div className='contact-grid'>
          <motion.div
            className='contact-info'
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Mari Terhubung</h3>
            <p>
              Punya proyek, kolaborasi, atau sekadar ingin berdiskusi soal teknologi? Silakan kirim pesan melalui form
              di samping atau hubungi saya langsung.
            </p>

            <div className='contact-list'>
              {contactItems.map(({ label, value, href, Icon }) => (
                <div key={label} className='contact-item'>
                  <span className='contact-icon'>
                    <Icon size={18} />
                  </span>
                  <div>
                    <span className='contact-label'>{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className='contact-value'
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={label === 'Email' ? `Kirim email ke ${value}` : undefined}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className='contact-value'>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='contact-socials'>
              {socialItems
                .filter((item) => item.href)
                .map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    className='social-btn'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={label}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
            </div>
          </motion.div>

          <motion.form
            className='contact-form'
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className='form-group'>
              <label htmlFor='contact-name'>Nama</label>
              <input
                id='contact-name'
                name='name'
                type='text'
                placeholder='Nama lengkap'
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='contact-email'>Email</label>
              <input
                id='contact-email'
                name='email'
                type='email'
                placeholder='email@example.com'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='contact-message'>Pesan</label>
              <textarea
                id='contact-message'
                name='message'
                rows='5'
                placeholder='Ceritakan kebutuhan Anda'
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button type='submit' className='btn btn-primary btn-large form-submit' whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Send size={18} />
              {isReady ? 'Kirim via WhatsApp' : 'WhatsApp Belum Tersedia'}
            </motion.button>
            {submissionStatus ? (
              <p className='form-note' role='status'>{submissionStatus}</p>
            ) : (
              <p className='form-note'>
                {isReady
                  ? 'Pesan akan disiapkan di WhatsApp. Tekan Kirim di WhatsApp untuk mengirimkannya.'
                  : 'Atur nomor WhatsApp di src/config/profile.js untuk mengaktifkan form.'}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;