import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Users } from 'lucide-react';

const VISIT_SESSION_KEY = 'portfolio-visit-counted';

const PortfolioStats = () => {
  const [visits, setVisits] = useState(null);
  const [displayedVisits, setDisplayedVisits] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    const requestTimer = window.setTimeout(() => {
      let hasCountedVisit = false;

      try {
        hasCountedVisit = window.sessionStorage.getItem(VISIT_SESSION_KEY) === 'true';
      } catch {
        // Count the visit when session storage is unavailable.
      }

      fetch('/api/visits', {
        method: hasCountedVisit ? 'GET' : 'POST',
        signal: controller.signal
      })
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Penghitung kunjungan tidak tersedia.');
          if (!Number.isSafeInteger(result.visits) || result.visits < 0) {
            throw new Error('Data penghitung kunjungan tidak valid.');
          }
          if (!hasCountedVisit) {
            try {
              window.sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
            } catch {
              // The global counter still works when session storage is unavailable.
            }
          }
          setVisits(result.visits);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Could not load portfolio visit count.', error);
          }
        });
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (visits === null) return undefined;
    if (shouldReduceMotion) return undefined;

    let frameId;
    const startedAt = performance.now();
    const duration = 1_000;

    const animateCount = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayedVisits(Math.round(visits * easedProgress));
      if (progress < 1) frameId = requestAnimationFrame(animateCount);
    };

    frameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frameId);
  }, [visits, shouldReduceMotion]);

  const stats = [
    {
      icon: Eye,
      value: visits === null ? '—' : (shouldReduceMotion ? visits : displayedVisits).toLocaleString('id-ID'),
      label: 'Kunjungan portfolio'
    },
    { icon: Users, value: '50+', label: 'Klien ditangani' }
  ];

  return (
    <div className='portfolio-stats' aria-label='Statistik portfolio'>
      {stats.map(({ icon: Icon, value, label }) => (
        <motion.div
          className='portfolio-stat'
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.65 }}
        >
          <span className='portfolio-stat-icon'><Icon size={17} aria-hidden='true' /></span>
          <span className='portfolio-stat-copy'>
            <strong aria-live={label === 'Kunjungan portfolio' ? 'polite' : undefined}>{value}</strong>
            <span>{label}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default PortfolioStats;
