import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const VISIT_SESSION_KEY = 'portfolio-visit-counted';
const VISIT_REFRESH_MS = 15_000;
const CLIENT_COUNT = 50;

const CountUp = ({ target, suffix = '', reducedMotion }) => {
  const [count, setCount] = useState(() => (reducedMotion ? target : target > 0 ? 1 : 0));
  const currentCount = useRef(count);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const startCount = currentCount.current;
    const startedAt = performance.now();
    const duration = 1_100;
    let frameId;

    const animateCount = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextCount = Math.round(startCount + (target - startCount) * easedProgress);
      currentCount.current = nextCount;
      setCount(nextCount);
      if (progress < 1) frameId = requestAnimationFrame(animateCount);
    };

    frameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion, target]);

  const displayedCount = reducedMotion ? target : count;
  return <>{displayedCount.toLocaleString('id-ID')}{suffix}</>;
};

const PortfolioStats = () => {
  const [visits, setVisits] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    let hasCountedVisit = false;

    try {
      hasCountedVisit = window.sessionStorage.getItem(VISIT_SESSION_KEY) === 'true';
    } catch {
      // Count the visit when session storage is unavailable.
    }

    const loadVisits = async (countVisit) => {
      try {
        const response = await fetch('/api/visits', {
          method: countVisit ? 'POST' : 'GET',
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Penghitung kunjungan tidak tersedia.');
        if (!Number.isSafeInteger(result.visits) || result.visits < 0) {
          throw new Error('Data penghitung kunjungan tidak valid.');
        }
        if (countVisit) {
          hasCountedVisit = true;
          try {
            window.sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
          } catch {
            // The global counter still works when session storage is unavailable.
          }
        }
        setVisits(result.visits);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Could not load portfolio visit count.', error);
        }
      }
    };

    const requestTimer = window.setTimeout(() => {
      loadVisits(!hasCountedVisit);
    }, 0);
    const refreshTimer = window.setInterval(() => {
      if (hasCountedVisit) loadVisits(false);
    }, VISIT_REFRESH_MS);

    return () => {
      window.clearTimeout(requestTimer);
      window.clearInterval(refreshTimer);
      controller.abort();
    };
  }, []);

  const stats = [
    {
      value: visits === null ? '—' : <CountUp target={visits} reducedMotion={shouldReduceMotion} />,
      label: 'Kunjungan portfolio'
    },
    {
      value: <CountUp target={CLIENT_COUNT} suffix='+' reducedMotion={shouldReduceMotion} />,
      label: 'Klien ditangani'
    }
  ];

  return (
    <div className='portfolio-stats' aria-label='Statistik portfolio'>
      {stats.map(({ value, label }, index) => (
        <motion.div
          className='portfolio-stat'
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.65 + index * 0.12 }}
        >
          <strong>{value}</strong>
          <span>{label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default PortfolioStats;
