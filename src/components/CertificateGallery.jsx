import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { certificateGroups } from '../data/certificates';
import SectionTitle from './SectionTitle';

const certificates = certificateGroups.flatMap((group) =>
  group.certificates.map((certificate) => ({
    ...certificate,
    category: group.title
  }))
);

const getOriginalIndex = (index) => {
  if (index === 0) return certificates.length - 1;
  if (index === certificates.length + 1) return 0;
  return index - 1;
};

const CertificateGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const closeButtonRef = useRef(null);
  const scrollerRef = useRef(null);
  const activeIndexRef = useRef(1);
  const settleTimerRef = useRef(null);
  const selectedCertificate = selectedIndex === null ? null : certificates[selectedIndex];

  const scrollToCard = useCallback((index, behavior = 'smooth') => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector(`[data-certificate-index="${index}"]`);
    if (!scroller || !card) return;

    scroller.scrollTo({
      left: scroller.scrollLeft + card.getBoundingClientRect().left - scroller.getBoundingClientRect().left,
      behavior
    });
  }, []);

  const syncActiveIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerLeft = scroller.getBoundingClientRect().left;
    const cards = Array.from(scroller.querySelectorAll('.certificate-card'));
    const closestCard = cards.reduce((closest, card) => {
      const distance = Math.abs(card.getBoundingClientRect().left - scrollerLeft);
      return distance < closest.distance ? { card, distance } : closest;
    }, { card: null, distance: Infinity }).card;

    if (closestCard) activeIndexRef.current = Number(closestCard.dataset.certificateIndex);

    if (activeIndexRef.current === 0) {
      activeIndexRef.current = certificates.length;
      scrollToCard(certificates.length, 'instant');
    } else if (activeIndexRef.current === certificates.length + 1) {
      activeIndexRef.current = 1;
      scrollToCard(1, 'instant');
    }
  }, [scrollToCard]);

  useEffect(() => {
    scrollToCard(1, 'instant');
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const handleScroll = () => {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(syncActiveIndex, 180);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      window.clearTimeout(settleTimerRef.current);
    };
  }, [scrollToCard, syncActiveIndex]);

  useEffect(() => {
    if (isHovered || selectedIndex !== null || certificates.length < 2) return undefined;

    const interval = window.setInterval(() => {
      const nextIndex = activeIndexRef.current + 1;
      activeIndexRef.current = nextIndex;
      scrollToCard(nextIndex);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isHovered, scrollToCard, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowRight') {
        setSelectedIndex((index) => (index + 1) % certificates.length);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((index) => (index - 1 + certificates.length) % certificates.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [selectedIndex]);

  const moveToCard = (direction) => {
    const nextIndex = activeIndexRef.current + direction;
    activeIndexRef.current = nextIndex;
    scrollToCard(nextIndex);
  };

  const displayedCertificates = certificates.length > 1
    ? [certificates[certificates.length - 1], ...certificates, certificates[0]]
    : certificates;

  return (
    <section id='certificates' className='section certificate-section'>
      <div className='container'>
        <SectionTitle title='Sertifikat Kampus' subtitle='Pencapaian & partisipasi' />
        <div className='certificate-slider-toolbar'>
         
          {certificates.length > 1 && (
            <div className='certificate-scroll-controls'>
              <button type='button' onClick={() => moveToCard(-1)} aria-label='Sertifikat sebelumnya'>
                <ChevronLeft size={19} />
              </button>
              <button type='button' onClick={() => moveToCard(1)} aria-label='Sertifikat berikutnya'>
                <ChevronRight size={19} />
              </button>
            </div>
          )}
        </div>

        <div
          className='certificate-grid'
          ref={scrollerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {displayedCertificates.map((certificate, index) => {
            const certificateIndex = certificates.length > 1
              ? index === 0
                ? 0
                : index === displayedCertificates.length - 1
                  ? certificates.length + 1
                  : index
              : index + 1;
            const originalIndex = getOriginalIndex(certificateIndex);

            return (
              <motion.button
                key={`${certificate.id}-${index}`}
                type='button'
                className='certificate-card'
                data-certificate-index={certificateIndex}
                onClick={() => setSelectedIndex(originalIndex)}
                aria-label={`Lihat preview ${certificate.title}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className='certificate-thumbnail'>
                  <img src={certificate.image} alt={`Preview ${certificate.title}`} loading='lazy' />
                  <span className='certificate-view-hint'><Award size={16} /> Klik untuk memperbesar</span>
                </span>
                <span className='certificate-card-details'>
                  <span className='certificate-card-category'>{certificate.category}</span>
                  <span className='certificate-card-title'>{certificate.title}</span>
                  <span className='certificate-meta'>
                    <span>{certificate.issuer}</span>
                    <span>{certificate.year}</span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className='certificate-lightbox'
            role='presentation'
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedIndex(null);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='certificate-lightbox-dialog'
              role='dialog'
              aria-modal='true'
              aria-labelledby='certificate-lightbox-title'
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
            >
              <div className='certificate-lightbox-toolbar'>
                <div>
                  <h3 id='certificate-lightbox-title'>{selectedCertificate.title}</h3>
                  <p>{selectedCertificate.category} · {selectedCertificate.issuer} · {selectedCertificate.year}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type='button'
                  className='certificate-lightbox-close'
                  onClick={() => setSelectedIndex(null)}
                  aria-label='Tutup preview sertifikat'
                >
                  <X size={20} />
                </button>
              </div>
              <div className='certificate-lightbox-image'>
                <img src={selectedCertificate.image} alt={`Preview penuh ${selectedCertificate.title}`} />
              </div>
              <div className='certificate-lightbox-navigation'>
                <button
                  type='button'
                  onClick={() => setSelectedIndex((index) => (index - 1 + certificates.length) % certificates.length)}
                  aria-label='Sertifikat sebelumnya'
                >
                  <ChevronLeft size={19} /> Sebelumnya
                </button>
                <span>{selectedIndex + 1} / {certificates.length}</span>
                <button
                  type='button'
                  onClick={() => setSelectedIndex((index) => (index + 1) % certificates.length)}
                  aria-label='Sertifikat berikutnya'
                >
                  Berikutnya <ChevronRight size={19} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificateGallery;
