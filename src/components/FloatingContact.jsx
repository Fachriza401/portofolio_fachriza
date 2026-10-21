import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { profile } from '../config/profile';
import ChatAssistant from './ChatAssistant';

const isConfigured = (value, placeholder) => Boolean(value) && value !== placeholder;

const whatsappNumber = isConfigured(profile.whatsapp, 'YOUR_WHATSAPP_NUMBER')
  ? profile.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  : null;

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className='floating-contact'>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            type='button'
            key='to-top'
            className='floating-btn floating-btn-top'
            onClick={scrollToTop}
            aria-label='Kembali ke atas'
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <ChatAssistant />

      {whatsappNumber && (
        <motion.a
          href={`https://wa.me/${whatsappNumber}`}
          className='floating-btn floating-btn-whatsapp'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Hubungi via WhatsApp'
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
        >
          <MessageCircle size={22} />
          <span className='floating-ring' />
        </motion.a>
      )}
    </div>
  );
};

export default FloatingContact;