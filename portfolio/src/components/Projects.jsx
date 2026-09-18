import { useEffect, useRef, useState } from 'react'

const projects = [
  {
    title: 'Sarathi',
    subtitle: 'AI-Powered Transport Management',
    description: 'An intelligent business transport management system leveraging AI to optimize logistics, route planning, and fleet management. Built to streamline transportation operations with smart decision-making capabilities.',
    technologies: ['Python', 'AI/ML', 'Full-Stack'],
    features: [
      'AI-powered route optimization',
      'Real-time fleet tracking',
      'Smart logistics management',
      'Data-driven decision making',
    ],
    github: 'https://github.com/SRUJAN17-MK',
    live: null,
    featured: true,
    status: 'In Development',
  },
  {
    title: 'Web Development Level 2',
    subtitle: 'Full-Stack Web Applications',
    description: 'A collection of full-stack web applications demonstrating proficiency in frontend development, user authentication, and interactive UI design. Includes multiple practical applications built with modern web technologies.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'DOM API'],
    features: [
      'Calculator with responsive UI',
      'Interactive To-Do Application',
      'User Login System with validation',
      'Tribute Page with modern design',
    ],
    github: 'https://github.com/SRUJAN17-MK/web-development-level2',
    live: null,
    featured: false,
    status: 'Completed',
  },
  {
    title: 'DSA in Java',
    subtitle: 'Data Structures & Algorithms',
    description: 'A comprehensive collection of data structures and algorithms implemented in Java. Covers fundamental CS concepts including arrays, linked lists, trees, graphs, sorting, and searching algorithms.',
    technologies: ['Java', 'DSA', 'OOP'],
    features: [
      'Core data structure implementations',
      'Algorithm analysis & optimization',
      'Problem-solving approaches',
      'Object-oriented design patterns',
    ],
    github: 'https://github.com/SRUJAN17-MK/DSAINJAVA',
    live: null,
    featured: false,
    status: 'Completed',
  },
]

function ProjectCard({ project, index, isVisible }) {
  return (
    <div
      className={`group rounded-2xl overflow-hidden transition-all duration-500 ${
        project.featured
          ? 'glass border border-primary/20 sm:col-span-2'
          : 'glass'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-medium mb-3">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-bold mb-1 group-hover:text-primary-light transition-colors">
              {project.title}
            </h3>
            <p className="text-text-muted text-sm font-mono">{project.subtitle}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            project.status === 'In Development'
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-green-500/10 text-green-400'
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="mb-6">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Key Features</h4>
          <ul className="grid sm:grid-cols-2 gap-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-surface-lighter text-text-secondary text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border-light/50">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-lighter text-text-secondary text-sm font-medium hover:bg-primary/10 hover:text-primary-light transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Source Code
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary-light text-sm font-medium hover:bg-primary/20 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Projects</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
          </div>

          <div className="grid gap-6">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={idx}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
