import { useEffect, useRef, useState } from 'react'

const repos = [
  {
    name: 'srujanmk',
    description: 'Profile README with tech stack and career details',
    language: null,
    stars: 0,
    forks: 0,
    url: 'https://github.com/SRUJAN17-MK/srujanmk',
  },
  {
    name: 'web-development-level2',
    description: 'Calculator, Tribute Page, To-Do App, Login System',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    url: 'https://github.com/SRUJAN17-MK/web-development-level2',
  },
  {
    name: 'DSAINJAVA',
    description: 'Data Structures and Algorithms in Java',
    language: 'Java',
    stars: 0,
    forks: 0,
    url: 'https://github.com/SRUJAN17-MK/DSAINJAVA',
  },
]

const languageColors = {
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Python: '#3572A5',
}

export default function GitHub() {
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
    <section id="github" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">GitHub</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border-light to-transparent" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 hover-lift sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold">SRUJAN17-MK</h3>
                    <p className="text-text-muted text-sm">3 repositories</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-text-secondary">1 follower</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="text-text-secondary">2 following</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['Python', 'JavaScript', 'Java', 'React', 'AI/ML'].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-full bg-surface-lighter text-text-secondary text-xs">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href="https://github.com/SRUJAN17-MK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Follow on GitHub
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {repos.map((repo, idx) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block glass rounded-xl p-5 hover-lift transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <h3 className="font-semibold text-primary-light">{repo.name}</h3>
                    </div>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <p className="text-text-secondary text-sm mb-3">{repo.description}</p>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: languageColors[repo.language] || '#ccc' }}
                        />
                        {repo.language}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {repo.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {repo.forks}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
