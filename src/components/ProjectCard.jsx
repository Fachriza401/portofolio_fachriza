import { motion } from 'framer-motion';

const ProjectCard = ({ project, index, projectIndex, isClone = false }) => {
  return (
    <motion.div
      className='project-card'
      data-project-index={projectIndex}
      aria-hidden={isClone || undefined}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      viewport={{ once: true }}
    >
      <div className='project-image'>
        <img src={project.image} alt={`${project.title} — desain dan tampilan aplikasi`} loading='lazy' />
      </div>
      <div className='project-content'>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className='project-tech'>
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
