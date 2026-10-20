import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import SectionTitle from './SectionTitle';

const Projects = () => {
  const scrollerRef = useRef(null);
  const activeIndexRef = useRef(1);
  const settleTimerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToCard = useCallback((index, behavior = 'smooth') => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector(`[data-project-index="${index}"]`);
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
    const cards = Array.from(scroller.querySelectorAll('.project-card'));
    const closestCard = cards.reduce((closest, card) => {
      const distance = Math.abs(card.getBoundingClientRect().left - scrollerLeft);
      return distance < closest.distance ? { card, distance } : closest;
    }, { card: null, distance: Infinity }).card;

    if (closestCard) {
      activeIndexRef.current = Number(closestCard.dataset.projectIndex);
    }

    const projectCount = projects.length;
    if (activeIndexRef.current === 0) {
      activeIndexRef.current = projectCount;
      scrollToCard(projectCount, 'instant');
    } else if (activeIndexRef.current === projectCount + 1) {
      activeIndexRef.current = 1;
      scrollToCard(1, 'instant');
    }
  }, [scrollToCard]);

  useEffect(() => {
    scrollToCard(1, 'instant');
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const handleScrollEnd = () => {
      window.clearTimeout(settleTimerRef.current);
      syncActiveIndex();
    };
    const handleScroll = () => {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(handleScrollEnd, 180);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      window.clearTimeout(settleTimerRef.current);
    };
  }, [scrollToCard, syncActiveIndex]);

  useEffect(() => {
    if (isHovered) return undefined;

    const interval = window.setInterval(() => {
      const nextIndex = activeIndexRef.current + 1;
      activeIndexRef.current = nextIndex;
      scrollToCard(nextIndex);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isHovered, scrollToCard]);

  const scrollProjects = useCallback((direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const nextIndex = activeIndexRef.current + direction;
    if (nextIndex < 0 || nextIndex > projects.length + 1) return;
    activeIndexRef.current = nextIndex;
    scrollToCard(nextIndex);
  }, [scrollToCard]);

  return (
    <section id='projects' className='section projects-section'>
      <div className='container'>
        <SectionTitle title='Selected Projects' subtitle='My recent work' />
        <div className='projects-toolbar'>
                  <div className='projects-controls'>
            <button type='button' onClick={() => scrollProjects(-1)} aria-label='Proyek sebelumnya'>
              <ArrowLeft size={19} />
            </button>
            <button type='button' onClick={() => scrollProjects(1)} aria-label='Proyek berikutnya'>
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
        <div
          className='projects-scroller'
          ref={scrollerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {[projects[projects.length - 1], ...projects, projects[0]].map((project, index) => (
            <ProjectCard
              key={`${project.id}-${index}`}
              project={project}
              index={index}
              projectIndex={index}
              isClone={index === 0 || index === projects.length + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
